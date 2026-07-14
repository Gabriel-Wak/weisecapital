"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/utils/format";

interface MortgageSimulatorProps {
  defaultPrice?: number;
}

function sliderValue(value: number | readonly number[]): number {
  if (Array.isArray(value)) return value[0] ?? 0;
  return value as number;
}

export function MortgageSimulator({ defaultPrice = 500000 }: MortgageSimulatorProps) {
  const [price, setPrice] = useState(defaultPrice);
  const [downPayment, setDownPayment] = useState(20);
  const [years, setYears] = useState(30);
  const [rate, setRate] = useState(9.5);

  const financed = price * (1 - downPayment / 100);
  const monthlyRate = rate / 100 / 12;
  const months = years * 12;
  const installment =
    monthlyRate > 0
      ? (financed * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
      : financed / months;

  return (
    <Card className="border-0 p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Simulador de Financiamento</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Estime o valor da parcela mensal
      </p>

      <div className="mt-6 space-y-6">
        <div className="space-y-2">
          <Label>Valor do imóvel</Label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label>Entrada: {downPayment}%</Label>
          <Slider
            value={[downPayment]}
            onValueChange={(value) => setDownPayment(sliderValue(value))}
            min={0}
            max={80}
            step={5}
          />
        </div>

        <div className="space-y-2">
          <Label>Prazo: {years} anos</Label>
          <Slider
            value={[years]}
            onValueChange={(value) => setYears(sliderValue(value))}
            min={5}
            max={35}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label>Taxa de juros: {rate}% a.a.</Label>
          <Slider
            value={[rate]}
            onValueChange={(value) => setRate(sliderValue(value))}
            min={6}
            max={15}
            step={0.1}
          />
        </div>

        <div className="rounded-xl bg-primary/5 p-4 text-center">
          <p className="text-sm text-muted-foreground">Parcela estimada</p>
          <p className="text-3xl font-bold text-primary">
            {formatCurrency(installment)}
            <span className="text-base font-normal text-muted-foreground">/mês</span>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Financiado: {formatCurrency(financed)} · {months} parcelas
          </p>
        </div>
      </div>
    </Card>
  );
}
