const axios = require("axios");

module.exports = async function (product_list) {
  const ans = [];
  for (const product_name of product_list)
    try {
      const response = await axios.get(
        `https://api.storerestapi.com/products/${product_name}`
      );
      ans.push(new Array(response.data.data.price.toString()));
    } catch (error) {
      console.error(error);
    }
  console.log(ans);
  return ans;
};
