package com.example.householdbook.type;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TransactionType {

	INCOME("収入"), EXPENSE("支出");

	private final String label;
}