import React from "react";

import { cn } from "@/lib/utils";

export type CurrencyLike = {
  code: string;
  name?: string;
  symbol?: string | null;
};

type UgxOnlyCurrencySelectorProps = {
  currencies: CurrencyLike[];
  value?: string | null;
  onChange: (currencyCode: string) => void;
  title?: string;
  enabledCode?: string;
  className?: string;
};

export default function UgxOnlyCurrencySelector({
  currencies,
  value,
  onChange,
  title = "Currency",
  enabledCode = "UGX",
  className,
}: UgxOnlyCurrencySelectorProps) {
  const normalizedValue = (value || "").trim().toUpperCase();

  if (!currencies.length) {
    return (
      <div className={cn("space-y-2", className)}>
        {!!title && <div className="text-sm font-medium">{title}</div>}
        <div className="text-sm text-muted-foreground">Loading currencies...</div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {!!title && <div className="text-sm font-medium">{title}</div>}

      <div className="flex flex-wrap gap-2">
        {currencies.map((currency) => {
          const code = (currency.code || "").trim().toUpperCase();
          const isEnabled = code === enabledCode;
          const isSelected = normalizedValue === code;

          return (
            <button
              key={code}
              type="button"
              disabled={!isEnabled}
              onClick={() => isEnabled && onChange(code)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : isEnabled
                    ? "bg-background hover:bg-accent border-border"
                    : "bg-muted/30 text-muted-foreground border-border opacity-60 cursor-not-allowed"
              )}
            >
              <span>
                {code}
                {currency.symbol ? ` (${currency.symbol})` : ""}
              </span>
              {!isEnabled && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  Coming Soon
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="text-xs text-muted-foreground">Only {enabledCode} is available right now.</div>
    </div>
  );
}
