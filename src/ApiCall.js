import axios from "axios";
import "./index.css";

const BASE_URL = "http://127.0.0.1:8000/api/";

export class ApiCall {
  call = (endPoint, method, body = null, condition = false, callBack) => {
    if (method === "POST") {
      if (body === null) {
        axios
          .post(BASE_URL + endPoint, {})
          .then(function (response) {
            callBack(response);
            return response;
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        let data = condition
          ? { "records-per-page": Object.values(body)[0] }
          : body;

        axios
          .post(BASE_URL + endPoint, data)
          .then(function (response) {
            callBack(response);

            return response;
          })
          .catch(function (error) {});
      }
    } else if (method === "PUT") {
      if (body === null) {
        axios
          .put(BASE_URL + endPoint, {})
          .then(function (response) {
            callBack(response);

            return response;
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        axios
          .put(BASE_URL + endPoint, body)
          .then(function (response) {
            callBack(response);

            return response;
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    } else if (method === "DELETE") {
      axios
        .delete(BASE_URL + endPoint, {})
        .then(function (response) {
          callBack(response);

          return response;
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };
}

export default ApiCall;
