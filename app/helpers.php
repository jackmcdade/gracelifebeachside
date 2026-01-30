<?php

if (!function_exists('random_from_array')) {
    /**
     * Get a random number from a preset array of numbers.
     *
     * @param array<int> $numbers
     * @return int
     */
    function random_from_array(array $numbers): int
    {
        return $numbers[array_rand($numbers)];
    }
}
