/**
 * Black-Scholes European Option Pricing & Quantitative Greeks Model
 * With Volatility Surface Grid & Skew Engine
 */

// Cumulative Standard Normal Distribution using Hastings approximation
export function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x) / Math.SQRT2;

  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return 0.5 * (1.0 + sign * y);
}

// Standard Normal Probability Density Function
export function normalPDF(x: number): number {
  return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
}

export interface OptionGreeks {
  callPrice: number;
  putPrice: number;
  callDelta: number;
  putDelta: number;
  gamma: number;
  vega: number;     // dollar sensitivity per 1% move in IV
  callTheta: number; // daily decay
  putTheta: number;
  callRho: number;
  putRho: number;
  d1: number;
  d2: number;
}

/**
 * Calculates theoretical European option price and Greeks using Black-Scholes formula
 * @param S Current Spot Price
 * @param K Strike Price
 * @param T Time to expiration in years (e.g. 30/365)
 * @param r Risk-free interest rate (e.g. 0.065 for 6.5%)
 * @param sigma Implied Volatility as a decimal (e.g. 0.22 for 22%)
 * @param q Continuous dividend yield (e.g. 0.015 for 1.5%)
 */
export function calculateBlackScholes(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  q: number = 0.015
): OptionGreeks {
  // Prevent division by zero or negative expiration/volatility
  const time = Math.max(T, 0.001);
  const vol = Math.max(sigma, 0.001);
  const spot = Math.max(S, 0.01);
  const strike = Math.max(K, 0.01);

  const sqrtT = Math.sqrt(time);
  const d1 = (Math.log(spot / strike) + (r - q + 0.5 * vol * vol) * time) / (vol * sqrtT);
  const d2 = d1 - vol * sqrtT;

  const expNegQT = Math.exp(-q * time);
  const expNegRT = Math.exp(-r * time);

  const Nd1 = normalCDF(d1);
  const Nd2 = normalCDF(d2);
  const NNegD1 = normalCDF(-d1);
  const NNegD2 = normalCDF(-d2);
  const pdfD1 = normalPDF(d1);

  // Theoretical Prices
  const callPrice = Math.max(0, spot * expNegQT * Nd1 - strike * expNegRT * Nd2);
  const putPrice = Math.max(0, strike * expNegRT * NNegD2 - spot * expNegQT * NNegD1);

  // Greeks
  const callDelta = expNegQT * Nd1;
  const putDelta = -expNegQT * NNegD1;

  // Gamma is identical for Call and Put
  const gamma = (expNegQT * pdfD1) / (spot * vol * sqrtT);

  // Vega: sensitivity to 1% move in volatility
  const vega = (spot * expNegQT * sqrtT * pdfD1) / 100;

  // Theta: per day (1/365)
  const thetaCommon = -(spot * vol * expNegQT * pdfD1) / (2 * sqrtT);
  const callTheta = (thetaCommon - r * strike * expNegRT * Nd2 + q * spot * expNegQT * Nd1) / 365;
  const putTheta = (thetaCommon + r * strike * expNegRT * NNegD2 - q * spot * expNegQT * NNegD1) / 365;

  // Rho: sensitivity to 1% move in interest rate
  const callRho = (strike * time * expNegRT * Nd2) / 100;
  const putRho = (-strike * time * expNegRT * NNegD2) / 100;

  return {
    callPrice,
    putPrice,
    callDelta,
    putDelta,
    gamma,
    vega,
    callTheta,
    putTheta,
    callRho,
    putRho,
    d1,
    d2,
  };
}

export type SkewRegime = 'standard' | 'panic_put' | 'earnings_spike' | 'flattened';

export interface VolatilityPoint {
  strike: number;
  moneyness: number; // K / S (e.g. 0.95 = 95% of spot)
  daysToExpiry: number; // e.g. 30
  tenorYears: number; // daysToExpiry / 365
  expiryLabel: string;
  impliedVol: number; // in percent, e.g. 24.5
  greeks: OptionGreeks;
  riskAssessment: {
    regime: string;
    level: 'Low' | 'Moderate' | 'High' | 'Extreme';
    description: string;
    convexityWarning: boolean;
  };
  gridI: number;
  gridJ: number;
}

export interface VolatilitySurfaceData {
  spotPrice: number;
  currency: string;
  baseAtmVol: number;
  points: VolatilityPoint[];
  strikes: number[];
  days: number[];
  grid: VolatilityPoint[][]; // grid[j_day][i_strike]
  minVol: number;
  maxVol: number;
  atmVol30D: number;
  skew25Delta: number; // 25d put vol - 25d call vol (Risk Reversal)
  fly25Delta: number;  // Butterfly convexity
  termStructureSlope: number; // 365D IV - 30D IV
}

/**
 * Computes market implied volatility using a parametric smile / term structure model
 */
export function getImpliedVol(
  moneyness: number, // K / S
  tenorYears: number, // T
  baseVol: number, // in percent, e.g. 20
  regime: SkewRegime = 'standard',
  ivShock: number = 0 // in percent, e.g. +5%
): number {
  const logMoneyness = Math.log(moneyness); // ln(K/S), 0 at ATM, negative for OTM Puts
  const sqrtT = Math.sqrt(Math.max(tenorYears, 0.02));

  // 1. Term structure component (normal contango: longer expiries have slightly higher vol)
  let termAdj = 0;
  if (regime === 'earnings_spike') {
    // Inverted term structure: short dated front-month IV spikes due to binary catalyst
    termAdj = 10.0 / (sqrtT + 0.3) - 6.0;
  } else {
    // Normal contango slope with slight mean reversion
    termAdj = 2.2 * Math.sqrt(tenorYears) - 1.2;
  }

  // 2. Skew slope (asymmetry: puts trade at higher IV than calls in equity markets)
  let skewSlope = -14.0; // standard equity put-skew
  if (regime === 'panic_put') {
    skewSlope = -26.0; // extreme downside put hedging
  } else if (regime === 'flattened') {
    skewSlope = -4.0;
  }

  // 3. Smile curvature (fat tail / kurtosis)
  let curvature = 16.0;
  if (regime === 'panic_put') {
    curvature = 28.0;
  }

  // SVI-like parametric term:
  // Vol smile flattens as time to expiry increases (1 / sqrtT term)
  const skewEffect = (skewSlope * logMoneyness + curvature * logMoneyness * logMoneyness) / (sqrtT + 0.15);

  const rawVol = baseVol + termAdj + skewEffect + ivShock;

  // Bound implied volatility to realistic financial levels (between 6% and 95%)
  return Math.max(6.0, Math.min(95.0, rawVol));
}

/**
 * Generates full 3D Volatility Surface grid and option pricing analytics
 */
export function generateVolatilitySurface(
  spotPrice: number,
  currency: string = '₹',
  baseVolatility: number = 22,
  regime: SkewRegime = 'standard',
  ivShock: number = 0,
  spotShockPercent: number = 0,
  riskFreeRate: number = 0.065
): VolatilitySurfaceData {
  const effectiveSpot = spotPrice * (1 + spotShockPercent / 100);

  // Expiration tenors (days)
  const expiries = [
    { days: 7, label: '7D (1W)' },
    { days: 14, label: '14D (2W)' },
    { days: 30, label: '30D (1M)' },
    { days: 60, label: '60D (2M)' },
    { days: 90, label: '90D (3M)' },
    { days: 180, label: '180D (6M)' },
    { days: 270, label: '270D (9M)' },
    { days: 365, label: '365D (1Y)' },
  ];

  // Moneyness ratios from 75% (deep OTM Put / ITM Call) to 125% (deep OTM Call / ITM Put)
  const moneynessRatios = [
    0.75, 0.80, 0.85, 0.90, 0.93, 0.96, 0.98, 1.0, 1.02, 1.04, 1.07, 1.10, 1.15, 1.20, 1.25,
  ];

  const grid: VolatilityPoint[][] = [];
  const allPoints: VolatilityPoint[] = [];

  let minVol = Infinity;
  let maxVol = -Infinity;

  const daysList = expiries.map((e) => e.days);
  const strikesList = moneynessRatios.map((m) => Math.round(effectiveSpot * m));

  expiries.forEach((exp, j) => {
    const row: VolatilityPoint[] = [];
    const tenorYears = exp.days / 365;

    moneynessRatios.forEach((m, i) => {
      const strike = strikesList[i];
      const iv = getImpliedVol(m, tenorYears, baseVolatility, regime, ivShock);

      if (iv < minVol) minVol = iv;
      if (iv > maxVol) maxVol = iv;

      const greeks = calculateBlackScholes(
        effectiveSpot,
        strike,
        tenorYears,
        riskFreeRate,
        iv / 100,
        0.015
      );

      // Determine risk assessment profile
      let riskLevel: 'Low' | 'Moderate' | 'High' | 'Extreme' = 'Moderate';
      let riskRegime = 'Balanced Vega/Theta';
      let convexityWarning = false;
      let description = '';

      if (m < 0.85) {
        riskLevel = 'High';
        riskRegime = 'Deep OTM Put Wing (Tail Risk)';
        description = 'Elevated crash premium pricing. High negative skew convexity; low delta but catastrophic event exposure.';
      } else if (m > 1.15) {
        riskLevel = 'Moderate';
        riskRegime = 'Far OTM Call Wing';
        description = 'Low delta convexity. High theta decay rate relative to option premium.';
      } else if (Math.abs(m - 1.0) <= 0.03 && exp.days <= 14) {
        riskLevel = 'Extreme';
        riskRegime = 'Gamma Pin Risk Peak';
        convexityWarning = true;
        description = 'Extreme gamma acceleration! Small spot moves create violent delta swings and accelerated daily theta decay.';
      } else if (Math.abs(m - 1.0) <= 0.05 && exp.days >= 90) {
        riskLevel = 'Moderate';
        riskRegime = 'High Vega Sweetspot';
        description = 'Significant sensitivity to macroeconomic implied volatility shocks with gradual theta decay.';
      } else {
        riskLevel = 'Low';
        riskRegime = 'Standard ATM Flow';
        description = 'Moderate delta sensitivity with predictable linear decay rate.';
      }

      const point: VolatilityPoint = {
        strike,
        moneyness: m,
        daysToExpiry: exp.days,
        tenorYears,
        expiryLabel: exp.label,
        impliedVol: Math.round(iv * 10) / 10,
        greeks,
        riskAssessment: {
          regime: riskRegime,
          level: riskLevel,
          description,
          convexityWarning,
        },
        gridI: i,
        gridJ: j,
      };

      row.push(point);
      allPoints.push(point);
    });

    grid.push(row);
  });

  // Calculate institutional metrics
  const atmPoint30D = grid[2]?.[7] || grid[0][0]; // 30D ATM (m=1.0)
  const otmPutPoint = grid[2]?.[2] || grid[0][0]; // ~85% moneyness
  const otmCallPoint = grid[2]?.[12] || grid[0][0]; // ~115% moneyness

  const atmVol30D = atmPoint30D.impliedVol;
  const skew25Delta = Math.round((otmPutPoint.impliedVol - otmCallPoint.impliedVol) * 10) / 10;
  const fly25Delta = Math.round(((otmPutPoint.impliedVol + otmCallPoint.impliedVol) / 2 - atmVol30D) * 10) / 10;

  const frontVol = grid[0]?.[7]?.impliedVol || atmVol30D;
  const backVol = grid[grid.length - 1]?.[7]?.impliedVol || atmVol30D;
  const termStructureSlope = Math.round((backVol - frontVol) * 10) / 10;

  return {
    spotPrice: effectiveSpot,
    currency,
    baseAtmVol: baseVolatility,
    points: allPoints,
    strikes: strikesList,
    days: daysList,
    grid,
    minVol: Math.floor(minVol),
    maxVol: Math.ceil(maxVol),
    atmVol30D,
    skew25Delta,
    fly25Delta,
    termStructureSlope,
  };
}
