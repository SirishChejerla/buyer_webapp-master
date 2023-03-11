export const financierParser = financier => {
  const financierData = {
    financierName: financier?.name,
    financierPAN: financier?.code,
    financierId: financier?.id,
    referralCode: financier?.referral_code,
    walletId: financier?.financier_wallet?.id,
    walletBalance: financier?.financier_wallet?.wallet_balance,
    fixedIRR: financier?.fixed_net_irr_to_be_given_to_investor_percentage,
    mba: {
      hasMBA: financier?.document_master_buy_agreement?.state === 'signed',
      url: financier?.document_master_buy_agreement?.service_url,
    },
    authorizedUser: {
      fullName: financier?.authorised_financier_user?.person?.user?.full_name,
      PAN: financier?.authorised_financier_user?.person?.person_kyc?.permanent_account_number,
      aadhaarNumber: financier?.authorised_financier_user?.person?.person_kyc?.mask_aadhaar,
      emailId: financier?.authorised_financier_user?.person?.user?.email,
      phone: financier.authorised_financier_user.person.user.phone,
      phoneNumber:
        '+' +
        financier?.authorised_financier_user?.person?.user?.country_code +
        ' ' +
        financier.authorised_financier_user.person.user.phone,
    },
    escrow: {
      accountNumber: financier?.financier_escrow_bank_account?.account_number,
      holderName: financier?.financier_escrow_bank_account?.account_holder_name,
      bankName: financier?.financier_escrow_bank_account?.bank_name,
      IFSC: financier?.financier_escrow_bank_account?.ifsc,
      branch: financier?.financier_escrow_bank_account?.branch,
      branchAddress: financier?.financier_escrow_bank_account?.branch_address,
    },
    financierBank: {
      id: financier?.financier_bank_account?.id,
      accountNumber: financier?.financier_bank_account?.account_number,
      holderName: financier?.financier_bank_account?.account_holder_name,
      bankName: financier?.financier_bank_account?.bank_name,
      IFSC: financier?.financier_bank_account?.ifsc,
    },
  }

  return financierData
}
