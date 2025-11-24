<?php

namespace App\Enums;

enum CategoriaDespesa: int
{
    case ALIMENTACAO = 1;
    case TRANSPORTE = 2;

    public function label(): string
    {
        return match ($this) {
            self::ALIMENTACAO => 'Alimentação',
            self::TRANSPORTE => 'Transporte',
        };
    }

    public static function fromValue(int $value): ?self
    {
        return self::tryFrom($value);
    }

    /**
     * Returns an array suitable for select inputs: [value => label]
     */
    public static function options(): array
    {
        $opts = [];
        foreach (self::cases() as $case) {
            $opts[$case->value] = $case->label();
        }

        return $opts;
    }
}
