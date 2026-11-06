import type { CalculatorSnapshot } from "@/types/domain";

export interface CalculatorInput {
  consumptionValue: number;
  consumptionUnit: "kg" | "tons";
  virginPricePerKg: number;
  primeflowPricePerKg: number;
  currency?: "IDR" | "USD";
}

export interface CalculatorValidationResult {
  valid: boolean;
  error?: string;
  snapshot?: CalculatorSnapshot;
}

export function calculateMaterialSavings(
  input: CalculatorInput
): CalculatorValidationResult {
  const {
    consumptionValue,
    consumptionUnit,
    virginPricePerKg,
    primeflowPricePerKg,
    currency = "IDR",
  } = input;

  if (!Number.isFinite(consumptionValue) || consumptionValue <= 0) {
    return {
      valid: false,
      error: "Monthly material consumption must be a positive number.",
    };
  }

  if (!Number.isFinite(virginPricePerKg) || virginPricePerKg <= 0) {
    return {
      valid: false,
      error: "Current virgin resin price per kilogram must be greater than zero.",
    };
  }

  if (!Number.isFinite(primeflowPricePerKg) || primeflowPricePerKg <= 0) {
    return {
      valid: false,
      error: "Estimated PrimeFlow price per kilogram must be greater than zero.",
    };
  }

  const monthlyVolumeKg =
    consumptionUnit === "tons" ? consumptionValue * 1000 : consumptionValue;

  const monthlyVirginCost = monthlyVolumeKg * virginPricePerKg;
  const monthlyPrimeflowCost = monthlyVolumeKg * primeflowPricePerKg;
  const monthlySavings = monthlyVirginCost - monthlyPrimeflowCost;
  const annualSavings = monthlySavings * 12;
  const percentageDifference =
    ((virginPricePerKg - primeflowPricePerKg) / virginPricePerKg) * 100;

  return {
    valid: true,
    snapshot: {
      consumptionUnit,
      monthlyVolumeKg: Math.round(monthlyVolumeKg * 100) / 100,
      virginPricePerKg: Math.round(virginPricePerKg * 100) / 100,
      primeflowPricePerKg: Math.round(primeflowPricePerKg * 100) / 100,
      monthlyVirginCost: Math.round(monthlyVirginCost * 100) / 100,
      monthlyPrimeflowCost: Math.round(monthlyPrimeflowCost * 100) / 100,
      monthlySavings: Math.round(monthlySavings * 100) / 100,
      annualSavings: Math.round(annualSavings * 100) / 100,
      percentageDifference: Math.round(percentageDifference * 100) / 100,
      currency,
    },
  };
}
