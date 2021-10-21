import { useEffect, useState } from 'react';
import {withRouter} from "react-router";
import axios from 'axios';
import { API_URL } from '../../../reducers/constants';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import AdminNavBar from '../AdminNavBar'

function Home({history, ...props}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log("(mount) in admin home");
    const storedUser = localStorage.getItem('role');
    // const parsedUser = storedUser);
    console.log("user: ", storedUser);
    if (
      document.cookie
        .split(";")
        .some(item => item.trim().startsWith("customer_uid="))
    ) {
      // Logged in
      let customer_uid = document.cookie
        .split("; ")
        .find(row => row.startsWith("customer_uid"))
        .split("=")[1];
      const role = localStorage.getItem('role');
      console.log("role: ", role);
      if(role === 'admin') {
        setMounted(true);
      } else {
        history.push('/meal-plan');
      }
      // axios
      //   .get(`${API_URL}Profile/${customer_uid}`)
      //   .then((response) => {
      //     const role = response.data.result[0].role.toLowerCase();
      //     if(role === 'admin') {
      //       setMounted(true);
      //     } else {
      //       history.push('/meal-plan');
      //     }
      //   })
      //   .catch((err) => {
      //     if (err.response) {
      //       // eslint-disable-next-line no-console
      //       console.log(err.response);
      //     }
      //     // eslint-disable-next-line no-console
      //     console.log(err);
      //   });
    } else {
      // Reroute to log in page
      history.push("/");
    }
  }, [history]);

  if(!mounted) {
    return null;
  }

  return (
    <div>
      <AdminNavBar/>
      <Breadcrumb>
        <Breadcrumb.Item active> Admin Site </Breadcrumb.Item>
      </Breadcrumb>
      <div>
        Welcome to Meal To Your Door Admin
      </div>
    </div>
  );
}

export default withRouter(Home);
