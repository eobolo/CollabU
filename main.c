#include "cs50.h"
#include <stdio.h>

// Define named constants for credit card lengths
#define VISA_LENGTH_1 13
#define VISA_LENGTH_2 16
#define MASTERCARD_LENGTH 16
#define AMEX_LENGTH 15

// Function to get the length of a credit card number
int get_card_length(long long card) {
    int length = 0;
    while (card > 0) {
        card /= 10;
        length++;
    }
    return length;
}

// Function to get the first digit of a credit card number
int get_first_digit(long long card) {
    while (card >= 10) {
        card /= 10;
    }
    return card;
}

// Function to get the second digit of a credit card number
int get_second_digit(long long card) {
    while (card >= 100) {
        card /= 10;
    }
    return card % 10;
}

// Function to calculate the sum of second-to-last digits
int calculate_second_to_last_sum(long long card, int length) {
    int sum = 0;
    for (int i = length; i > 0; i -= 2) {
        int digit = (card / 10) % 10;
        int product = digit * 2;
        if (product > 9) {
            sum += product / 10 + product % 10;
        } else {
            sum += product;
        }
        card /= 100;
    }
    return sum;
}

// Function to calculate the sum of last digits
int calculate_last_sum(long long card, int length) {
    int sum = 0;
    for (int i = length; i > 0; i -= 2) {
        sum += card % 10;
        card /= 100;
    }
    return sum;
}

int main(void) {
    long long card;
    do {
        card = get_long_long("Number: ");
    } while (card < 0);

    int length = get_card_length(card);

    // Check if the length is valid
    if (length != VISA_LENGTH_1 && length != VISA_LENGTH_2 && length != MASTERCARD_LENGTH && length != AMEX_LENGTH) {
        printf("INVALID\n");
        return 0;
    }

    // Calculate the sum of second-to-last and last digits
    int second_to_last_sum = calculate_second_to_last_sum(card, length);
    int last_sum = calculate_last_sum(card, length);
    int total_sum = second_to_last_sum + last_sum;

    // Check if the total sum is divisible by 10
    if (total_sum % 10 != 0) {
        printf("INVALID\n");
        return 0;
    }

    // Check the type of credit card and print the result
    int first_digit = get_first_digit(card);
    int second_digit = get_second_digit(card);
    if (length == AMEX_LENGTH) {
        if (first_digit == 3 && (second_digit == 4 || second_digit == 7)) {
            printf("AMEX\n");
        } else {
            printf("INVALID\n");
        }
    } else if (length == MASTERCARD_LENGTH) {
        if (first_digit == 5 && (second_digit >= 1 && second_digit <= 5)) {
            printf("MASTERCARD\n");
        } else if (first_digit == 4) {
            printf("VISA\n");
        } else {
            printf("INVALID\n");
        }
    } else if (length == VISA_LENGTH_1 || length == VISA_LENGTH_2) {
        if (first_digit == 4) {
            printf("VISA\n");
        } else {
            printf("INVALID\n");
        }
    }

    return 0;
}