import { useEffect, useState } from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import whiteLogo from "../../../images/White_logo_for_web.png";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { useHistory } from "react-router";
import styles from "./adminNavBar.module.css";
import hamburger from "../../../images/hamburger.png";
import forkClose from "../../../images/forkClose.png";

const LINK_WIDTH = {
  orders: "9%",
  donations: "11%",
  inventory: "10%",
  items: "9%",
  customers: "10%",
  donors: "9%",
  analytics: "12%",
  notifications: "13%",
  business_profile: "16%",
};

function NavBar(props) {
  const history = useHistory();

  const [businessImage, setBusinessImage] = useState(null);

  useEffect(() => {
    console.log("LOCALSTORAGE");
    console.log(localStorage);
    const account = JSON.parse(localStorage.getItem('account'));
    console.log(account);
    // const businessImage = account.businessImage
    setBusinessImage(account.business_image);
  }, []);
  
  useEffect(() => {
    console.log("businessImage: ", businessImage);
  }, [businessImage]);

  const [showDropdown, setShowDropdown] = useState(false);

  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    function handleResize() {
      if (dimensions.width > 1000 && showDropdown === true) {
        console.log("in handleResize");
        setShowDropdown(false);
      }
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }

    window.addEventListener("resize", handleResize);

    return (_) => {
      window.removeEventListener("resize", handleResize);
    };
  });

  return (
    <>
      {/* <div
      style={{
        border: '1px solid red',
        backgroundColor: '#F8BB17',
        display: 'flex',
        // alignItems: 'center',
        height: '80px',
        position: 'relative',
        zIndex: '100',
        width: '100vw',
        maxWidth: '100%'
      }}
    > */}

      {/* For debugging window size */}
      {/* <span 
				style={{
					zIndex: '101',
					position: 'fixed',
					backgroundColor: 'white',
					border: 'solid',
					borderWidth: '1px',
					borderColor: 'green',
					width: '150px',
          top: '500px'
				}}
			>
				Height: {dimensions.height}px
				<br />
				Width: {dimensions.width}px
			</span> */}

      {/* <div
        style={{
          // border: 'solid',
          width: '200px'
        }}
      >
        <a 
          href='/home' 
          style={{
            backgroundImage:`url(${whiteLogo})`,
            backgroundSize:'cover',
            marginTop: '10px',
            marginLeft: '20px',
            width: '140px',
            height: '70px'
          }}>
        </a>
      </div> */}

      {dimensions.width > 1000 ? (
        <div
          style={{
            // border: '1px solid white',
            backgroundColor: "#E7404A",
            display: "flex",
            // alignItems: 'center',
            height: "80px",
            position: "relative",
            zIndex: "100",
            width: "100vw",
            maxWidth: "100%",
          }}
        >
          <div
            style={{
              // border: 'solid',
              width: "200px",
              display: "flex",
              alignItems: "center",
              height: "80px",
            }}
          >
            <a
              href="/home"
              className={styles.navLink}
              style={{
                // // backgroundImage: `url(${whiteLogo})`,
                // backgroundSize: "cover",
                // marginTop: "10px",
                marginLeft: "20px",
                // marginRight: '20px',
                // width: "140px",
                // height: "70px",
                // border: '1px solid'
                fontWeight: "bold",
                color: "white",
              }}
            >
              Serving Now
            </a>
          </div>
          <div
            style={{
              width: "90%",
              maxWidth: "90%",
              display: "flex",
              alignItems: "center",
              height: "80px",
              // border: '1px solid'
            }}
          >
            <a
              href="/admin-v2/orders"
              className={styles.navLink}
              style={
                props.currentPage === "orders"
                  ? {
                      color: "black",
                      width: LINK_WIDTH.orders,
                    }
                  : {
                      width: LINK_WIDTH.orders,
                    }
              }
            >
              Orders
            </a>

            <a
              href="/admin-v2/donations"
              className={styles.navLink}
              style={
                props.currentPage === "donations"
                  ? {
                      color: "black",
                      width: LINK_WIDTH.donations,
                    }
                  : {
                      width: LINK_WIDTH.donations,
                    }
              }
            >
              Donations
            </a>

            <a
              href="/admin-v2/inventory"
              className={styles.navLink}
              style={
                props.currentPage === "inventory"
                  ? {
                      color: "black",
                      width: LINK_WIDTH.inventory,
                    }
                  : {
                      width: LINK_WIDTH.inventory,
                    }
              }
            >
              Inventory
            </a>

            {/* <a
              href="/admin/ingredients-units"
              className={styles.navLink}
              style={
                props.currentPage === "ingredients-units"
                  ? {
                      color: "black",
                      width: LINK_WIDTH.ingredients_n_units,
                    }
                  : {
                      width: LINK_WIDTH.ingredients_n_units,
                    }
              }
            >
              Ingredients & Units
            </a> */}

            <a
              href="/admin-v2/items"
              className={styles.navLink}
              style={
                props.currentPage === "items"
                  ? {
                      color: "black",
                      width: LINK_WIDTH.items,
                    }
                  : {
                      width: LINK_WIDTH.items,
                    }
              }
            >
              Items
            </a>

            <a
              href="/admin-v2/customers"
              className={styles.navLink}
              style={
                props.currentPage === "customers"
                  ? {
                      color: "black",
                      width: LINK_WIDTH.customers,
                    }
                  : {
                      width: LINK_WIDTH.customers,
                    }
              }
            >
              Customers
            </a>

            <a
              href="/admin-v2/donors"
              className={styles.navLink}
              style={
                props.currentPage === "donors"
                  ? {
                      color: "black",
                      width: LINK_WIDTH.donors,
                    }
                  : {
                      width: LINK_WIDTH.donors,
                    }
              }
            >
              Donors
            </a>

            {/* <a
              href="/admin/plans-coupons"
              className={styles.navLink}
              style={
                props.currentPage === "plans-coupons"
                  ? {
                      color: "black",
                      width: LINK_WIDTH.coupons,
                    }
                  : {
                      width: LINK_WIDTH.coupons,
                    }
              }
            >
              Coupons
            </a> */}

            <a
              href="/admin-v2/google-analytics"
              className={styles.navLink}
              style={
                props.currentPage === "google-analytics"
                  ? {
                      color: "black",
                      width: LINK_WIDTH.analytics,
                    }
                  : {
                      width: LINK_WIDTH.analytics,
                    }
              }
            >
              Analytics
            </a>

            <a
              href="/admin-v2/notifications"
              className={styles.navLink}
              style={
                props.currentPage === "notifications"
                  ? {
                      color: "black",
                      width: LINK_WIDTH.notifications,
                    }
                  : {
                      width: LINK_WIDTH.notifications,
                    }
              }
            >
              Notifications
            </a>
            {/* <a
              href="/admin-v2/business-profile"
              className={styles.navLink}
              style={
                props.currentPage === "business-profile"
                  ? {
                      color: "black",
                      width: LINK_WIDTH.business_profile,
                    }
                  : {
                      width: LINK_WIDTH.business_profile,
                    }
              }
            >
              Business Profile
            </a> */}
            {/* <a
              href="/admin-v2/business-profile"
              className={styles.navLink}
              style={
                props.currentPage === "business-profile"
                  ? {
                      color: "black",
                      width: LINK_WIDTH.business_profile,
                    }
                  : {
                      width: LINK_WIDTH.business_profile,
                    }
              }
            >
              {businessImage === '' ? (
                "Business Profile"
              ) : (
                <img
                  src={businessImage}
                />
              )}
            </a> */}
            {businessImage === '' ? (
              <a
                href="/admin-v2/business-profile"
                className={styles.navLink}
                style={
                  props.currentPage === "business-profile"
                    ? {
                        color: "black",
                        width: LINK_WIDTH.business_profile,
                      }
                    : {
                        width: LINK_WIDTH.business_profile,
                      }
                }
              >
                Business Profile
              </a>
            ) : (
              <img
                src={businessImage}
                alt="couldn't load image"
                style={{
                  width: '70px',
                  height: '70px',
                  cursor: 'pointer',
                  // border: '1px dashed',
                  borderRadius: '50%'
                }}
                onClick={() => {
                  history.push('/admin-v2/business-profile');
                }}
              />
            )}
          </div>
        </div>
      ) : (
        <div
          style={{
            // border: '1px solid white',
            backgroundColor: "#E7404A",
            display: "flex",
            justifyContent: "center",
            // alignItems: 'center',
            height: "80px",
            position: "relative",
            zIndex: "100",
            width: "100vw",
            maxWidth: "100%",
          }}
        >
          {/* <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}
        > */}
          <div
            style={{
              position: "absolute",
              left: "0",
              height: "100%",
              paddingLeft: "30px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={
                showDropdown
                  ? {
                      width: "50px",
                      height: "50px",
                      backgroundImage: `url(${forkClose})`,
                      backgroundSize: "cover",
                      cursor: "pointer",
                    }
                  : {
                      width: "60px",
                      height: "40px",
                      backgroundImage: `url(${hamburger})`,
                      backgroundSize: "cover",
                      cursor: "pointer",
                    }
              }
              onClick={() => {
                setShowDropdown(!showDropdown);
              }}
            />
          </div>
          {showDropdown ? (
            <div
              style={{
                position: "absolute",
                left: "0",
                top: "80px",
                width: "100vw",
                height: "375px",
                backgroundColor: "#E7404A",
              }}
            >
              <div className={styles.dropdownLink}>
                <a
                  href="/admin-v2/order-ingredients"
                  className={styles.navLinkDD}
                  style={
                    props.currentPage === "order-ingredients"
                      ? { color: "black" }
                      : {}
                  }
                >
                  Orders
                </a>
              </div>
              <div className={styles.dropdownLink}>
                <a
                  href="/admin-v2/create-menu"
                  className={styles.navLinkDD}
                  style={
                    props.currentPage === "create-menu"
                      ? { color: "black" }
                      : {}
                  }
                >
                  Menu
                </a>
              </div>
              <div className={styles.dropdownLink}>
                <a
                  href="/admin-v2/edit-meal"
                  className={styles.navLinkDD}
                  style={
                    props.currentPage === "edit-meal" ? { color: "black" } : {}
                  }
                >
                  Businesses & Meals
                </a>
              </div>
              <div className={styles.dropdownLink}>
                <a
                  href="/admin-v2/ingredients-units"
                  className={styles.navLinkDD}
                  style={
                    props.currentPage === "ingredients-units"
                      ? { color: "black" }
                      : {}
                  }
                >
                  Ingredients & Units
                </a>
              </div>
              <div className={styles.dropdownLink}>
                <a
                  href="/admin-v2/customers"
                  className={styles.navLinkDD}
                  style={
                    props.currentPage === "customers" ? { color: "black" } : {}
                  }
                >
                  Customers
                </a>
              </div>
              <div className={styles.dropdownLink}>
                <a
                  href="/admin-v2/customers2"
                  className={styles.navLinkDD}
                  style={
                    props.currentPage === "customers2" ? { color: "black" } : {}
                  }
                >
                  Customers2
                </a>
              </div>
              <div className={styles.dropdownLink}>
                <a
                  href="/admin-v2/notifications"
                  className={styles.navLinkDD}
                  style={
                    props.currentPage === "notifications"
                      ? { color: "black" }
                      : {}
                  }
                >
                  Notifications
                </a>
              </div>
              <div className={styles.dropdownLink}>
                <a
                  href="/admin-v2/plans-coupons"
                  className={styles.navLinkDD}
                  style={
                    props.currentPage === "plans-coupons"
                      ? { color: "black" }
                      : {}
                  }
                >
                  Coupons
                </a>
              </div>
              <div className={styles.dropdownLink}>
                <a
                  href="/admin-v2/zones"
                  className={styles.navLinkDD}
                  style={
                    props.currentPage === "zones" ? { color: "black" } : {}
                  }
                >
                  Zones
                </a>
              </div>
              <div className={styles.dropdownLink}>
                <a
                  href="/admin-v2/google-analytics"
                  className={styles.navLinkDD}
                  style={
                    props.currentPage === "google-analytics"
                      ? { color: "black" }
                      : {}
                  }
                >
                  Analytics
                </a>
              </div>
            </div>
          ) : null}
          <div
            style={{
              // border: 'dashed',
              width: "200px",
            }}
          >
            <a
              href="/home"
              style={{
                // backgroundImage: `url(${whiteLogo})`,
                backgroundSize: "cover",
                marginTop: "10px",
                marginLeft: "20px",
                width: "140px",
                height: "70px",
                fontWeight: "bold",
              }}
            >
              Serving Now
            </a>
          </div>
        </div>
      )}

      {/* </div> */}
    </>
  );
}

export default NavBar;
