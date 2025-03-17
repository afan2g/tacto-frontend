import React from 'react';
import { Text } from 'react-native';

/**
 * Custom hook for consistent formatting of currency amounts throughout the app
 * @param {Object} options Configuration options for the formatter
 * @returns {Object} Formatting functions
 */
export const useAmountFormatter = (options = {}) => {
    const defaultOptions = {
        currency: 'USD',
        locale: 'en-US',
        maxDecimalPlaces: 2,
        showCurrency: true
    };

    const opts = { ...defaultOptions, ...options };

    /**
     * Format a numeric value as currency
     * @param {string|number} value The amount to format
     * @param {boolean} preserveTyping Whether to preserve user input formatting
     * @returns {string} Formatted currency value
     */
    const formatAmount = (value, preserveTyping = false) => {
        // Handle empty or invalid values
        if (!value && value !== 0 && value !== '0' && value !== '0.') {
            return '';
        }

        // If we're preserving typing format (during input), handle specially
        if (preserveTyping) {
            // Check if value has a decimal point
            const hasDecimal = String(value).includes('.');
            if (!hasDecimal) {
                // For whole numbers, format normally
                return new Intl.NumberFormat(opts.locale, {
                    style: opts.showCurrency ? 'currency' : 'decimal',
                    currency: opts.currency,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }).format(parseFloat(value || '0'));
            }

            // For values with decimal points
            const parts = String(value).split('.');
            const wholePart = parts[0] || "0";
            const decimalPart = parts.length > 1 ? parts[1] : "";

            // Format the whole number part
            const wholeFormatted = new Intl.NumberFormat(opts.locale, {
                style: opts.showCurrency ? 'currency' : 'decimal',
                currency: opts.currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(parseFloat(wholePart || '0'));

            // Return with decimal point and any existing decimal digits
            return `${wholeFormatted}${hasDecimal ? '.' : ''}${decimalPart}`;
        }

        // Standard formatting (not preserving typing format)
        const decimals = String(value).includes('.');
        return new Intl.NumberFormat(opts.locale, {
            style: opts.showCurrency ? 'currency' : 'decimal',
            currency: opts.currency,
            minimumFractionDigits: decimals ? opts.maxDecimalPlaces : 0,
            maximumFractionDigits: decimals ? opts.maxDecimalPlaces : 0,
        }).format(parseFloat(value || '0'));
    };

    /**
     * Get display elements for an amount with properly styled placeholders
     * @param {string|number} value The amount to format
     * @param {Object} placeholderStyle Style for placeholder digits
     * @returns {React.ReactNode} Formatted amount with styled placeholders
     */
    const getDisplayAmount = (value, placeholderStyle = {}) => {
        // Handle empty value
        if (!value && value !== 0) {
            return <Text style={placeholderStyle}>$0</Text>;
        }

        // Check if value has a decimal point
        const hasDecimal = String(value).includes('.');
        if (!hasDecimal) {
            // For whole numbers, just return the formatted value
            return formatAmount(value, true);
        }

        // For values with decimal points
        const parts = String(value).split('.');
        const decimalPart = parts.length > 1 ? parts[1] : "";

        // Format just the value we have (preserving typing format)
        const mainPart = formatAmount(value, true);

        // If we have all decimal places filled, just return the formatted value
        if (decimalPart.length >= opts.maxDecimalPlaces) {
            return mainPart;
        }

        // Calculate placeholder zeros needed
        const neededZeros = opts.maxDecimalPlaces - decimalPart.length;
        const placeholderZeros = neededZeros > 0 ? '0'.repeat(neededZeros) : "";

        // Return the formatted amount with styled placeholder zeros
        return (
            <>
                {mainPart}
                <Text style={placeholderStyle}>{placeholderZeros}</Text>
            </>
        );
    };

    /**
     * Format an amount for display in contexts where we're not editing
     * @param {string|number} value The amount to format
     * @returns {string} Properly formatted amount
     */
    const getFormattedAmount = (value) => {
        if (!value && value !== 0) return '$0';
        return formatAmount(value, false);
    };

    const getFormattedAmountWithoutSymbol = (value) => {
        return getFormattedAmount(value).substring(1);
    }

    return {
        formatAmount,
        getDisplayAmount,
        getFormattedAmount,
        getFormattedAmountWithoutSymbol
    };
};