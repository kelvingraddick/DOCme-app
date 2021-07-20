const Login = async function(userType, token) {
  return fetch('http://www.docmeapp.com/' + userType + '/authorize', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token }
  })
  .then((response) => { 
    if (response.status == 200) {
      return response.json()
      .then((responseJson) => {
        if (responseJson.isSuccess) {
          return responseJson;
        }
      })
    }
    return undefined;
  })
  .catch((error) => {
    console.error(error);
    return undefined;
  });
};

module.exports = Login;