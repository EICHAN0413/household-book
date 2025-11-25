package com.example.householdbook.entity;

import java.time.LocalDate;
import java.util.Objects;

import org.hibernate.Hibernate;

import com.example.householdbook.type.TransactionType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "household_transaction") // テーブル名も実態に合わせて変更推奨
@Getter
@Setter
@ToString
@NoArgsConstructor
public class HouseholdTransaction {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull(message = "取引日付は必須です")
	@Column(name = "transaction_date", nullable = false)
	private LocalDate transactionDate;

	@NotBlank(message = "説明は必須です")
	@Size(max = 255, message = "説明は255文字以内で入力してください")
	@Column(name = "description", nullable = false)
	private String description;

	@NotBlank(message = "カテゴリは必須です")
	@Size(max = 100, message = "カテゴリは100文字以内で入力してください")
	@Column(name = "category", nullable = false)
	private String category;

	@NotNull(message = "金額は必須です")
	@DecimalMin(value = "0.01", message = "金額は0より大きい値を入力してください")
	@Digits(integer = 8, fraction = 2, message = "金額は整数部8桁、小数部2桁までです")
	@Column(name = "amount", nullable = false, precision = 10, scale = 2)
	private String amount;

	@NotNull(message = "収支種別は必須です")
	@Enumerated(EnumType.STRING) // DBには文字列として保存 ("INCOME", "household_transaction")
	@Column(name = "type", nullable = false, length = 10)
	private TransactionType type;

	/**
	 * コンストラクタ（全フィールド用）
	 */
	public HouseholdTransaction(LocalDate transactionDate, String description, String category,
			@NotNull(message = "金額は必須です") @DecimalMin(value = "0.01", message = "金額は0より大きい値を入力してください") @Digits(integer = 8, fraction = 2, message = "金額は整数部8桁、小数部2桁までです") String amount,
			TransactionType type) {
		this.transactionDate = transactionDate;
		this.description = description;
		this.category = category;
		this.amount = amount;
		this.type = type;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o))
			return false;
		HouseholdTransaction that = (HouseholdTransaction) o;
		return id != null && Objects.equals(id, that.id);
	}

	@Override
	public int hashCode() {
		return getClass().hashCode();
	}
}