<?php
namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class UrlRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Prepend http:// if missing
        if (! preg_match('#^https?://#i', $value)) {
            $value = 'http://' . $value;
        }

        // Validate URL format
        if (! filter_var($value, FILTER_VALIDATE_URL)) {
            $fail("The :attribute must be a valid URL.");
            return;
        }
    }
}
