const Loan = require("../models/loan");

const fetchPastLoans = async (customer_id) => {
  const loans = await Loan.findAll({ where: { customer_id } });
  return loans;
};

function calculateMonthlyPayment(principal, annualInterestRate, years) {
  const monthlyInterestRate = annualInterestRate / 12; // Convert annual rate to monthly

  const monthlyPayment =
    (principal *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, years)) /
    (Math.pow(1 + monthlyInterestRate, years) - 1);

  return monthlyPayment;
}

const checkEligibility = async (customer_id, approved_limit) => {
  const maxLoanCountScore = 20; // Max points for the number of loans
  const maxActivityScore = 20; // Max points for recent loan activity
  const maxVolumeScore = 20; // Max points for approved loan volume

  const loans = await fetchPastLoans(customer_id);
  if (!loans.length) return 80;

  const punctualityScore = calculatePunctualityScore(loans);

  const idealLoanCount = 5; //  ideal count is 5
  const loanCountPenalty =
    maxLoanCountScore - Math.abs(loans.length - idealLoanCount) * 7; // 7 points deducted per loan above or below the ideal

  const currentYear = new Date().getFullYear();
  const loansThisYear = loans.filter(
    (loan) => new Date(loan.start_date).getFullYear() === currentYear
  );
  const activityScore = maxActivityScore - loansThisYear.length * 7; //  deduct 7 points for each loan this year from a base of 10

  // Adjusting for the range 1 lakh to 10 lakhs
  const maxApprovedVolumeThreshold = 10 * 100000; // 10 lakhs converted to base units if necessary
  const totalApprovedVolume = loans.reduce(
    (sum, loan) => sum + loan.loan_amount,
    0
  );
  if (totalApprovedVolume > approved_limit) {
    return 0; // Instant disqualification
  }

  // Calculate the percentage of the max threshold
  const approvedVolumePercentage = Math.min(
    1,
    totalApprovedVolume / maxApprovedVolumeThreshold
  );

  // Allocate points based on this percentage
  const approvedVolumeScore = approvedVolumePercentage * maxVolumeScore;

  // Deduct the penalties or add the scores calculated from each component
  const totalScore =
    punctualityScore + loanCountPenalty + activityScore + approvedVolumeScore;
  // Ensure the final score is within bounds
  const finalCreditScore = Math.max(0, Math.min(100, Math.round(totalScore)));
  return finalCreditScore;
};

function calculatePunctualityScore(loans) {
  const maxPunctualityScore = 40; // Max points for on-time payments

  if (loans.length === 0) {
    return maxPunctualityScore; // Optionally handle no loan data as full punctuality score or adjust as needed
  }

  let totalScore = 0;

  loans.forEach((loan) => {
    const { emis_paid_on_time, tenure } = loan;
    const paymentRatio = emis_paid_on_time / tenure;
    const loanPunctualityScore = paymentRatio * maxPunctualityScore;
    totalScore += loanPunctualityScore;
  });

  // Normalize score: Divide by the number of loans to average the score across all loans
  const normalizedScore = totalScore / loans.length;
  return normalizedScore;
}

module.exports = { checkEligibility, calculateMonthlyPayment };
