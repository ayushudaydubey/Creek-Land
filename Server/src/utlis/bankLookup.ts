export const getBankName = async (routingNumber: string) => {

  const banks: any = {
    "021000021": "JPMorgan Chase Bank",
    "011000015": "Bank of America"
  };

  return banks[routingNumber] || "Unknown Bank";

};