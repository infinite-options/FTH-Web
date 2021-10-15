import React from "react";

import styles from "../ServingNow/ClientForm.module.css";

export default function ClientForm() {
  return (
    <div>

      <div className={styles.header}>
        <h5> <b>Serving Now</b> </h5>
      </div>

      <div className={styles.rectangle1}> </div>

      <div className={styles.box4}> </div>

      

      <div className={styles.title3}>
          <h5> <b>Client Intake Form</b></h5>
      </div>

      {/* Client Info: */}

      <div className={styles.subheading1}>
          <h6 style={{fontSize:"16px"}}> <b>Client Info:</b></h6>
      </div>

      <div className={styles.ClientName}>
        <span className={styles.ClientNameInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "600px"}}
            type='text'
            placeholder='Client Name'
          />
          </span>
      </div>

      <div className={styles.SSN}>
        <span className={styles.SSNInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "600px"}}
            type='text'
            placeholder='Last 4 digits of Social Security'
          />
          </span>
      </div>

      <div className={styles.DOB}>
        <span class="DOBInput">
          <input
            style={{marginBottom: "0px", border: "0px", width: "600px"}}
            type='text'
            placeholder='DOB'
          />
          </span>
      </div>

      <div className={styles.CurrentAddress}>
        <span className={styles.CurrentAddressInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "600px"}}
            type='text'
            placeholder='Current Address'
          />
          </span>
      </div>

      <div className={styles.City1}>
        <span className={styles.City1Input}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "200px"}}
            type='text'
            placeholder='City'
          />
          </span>
      </div>

      <div className={styles.County}>
        <span className={styles.CountyInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "200px"}}
            type='text'
            placeholder='County'
          />
          </span>
      </div>

      <div className={styles.State}>
        <span className={styles.StateInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "200px"}}
            type='text'
            placeholder='State'
          />
          </span>
      </div>

      <div className={styles.ZipCode1}>
        <span className={styles.ZipCode1Input}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "200px"}}
            type='text'
            placeholder='Zip Code'
          />
          </span>
      </div>

      <div className={styles.HomePhone}>
        <span className={styles.HomePhoneInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "600px"}}
            type='text'
            placeholder='Phone (home)'
          />
          </span>
      </div>

      <div className={styles.CellPhone}>
        <span className={styles.CellPhoneInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "600px"}}
            type='text'
            placeholder='Phone (cell)'
          />
          </span>
      </div>

      {/* Household Info: */}
      <div className={styles.subheading2}>
          <h6 style={{fontSize:"16px"}}> <b>Household Info:</b></h6>
      </div>

      <div className={styles.subheading2text}>
          <h6 style={{fontSize:"16px"}}> List names, ages and relationships of household family members</h6>
      </div>

      <div className={styles.Member}>
          <h6 style={{fontSize:"16px", color: "#e7404a"}}> Member 1: </h6>
      </div>

      <div className={styles.Name}>
        <span className={styles.NameInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "600px"}}
            type='text'
            placeholder='Name'
          />
          </span>
      </div>

      <div className={styles.Age}>
        <span className={styles.AgeInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "200px"}}
            type='text'
            placeholder='Age'
          />
          </span>
      </div>

      <div className={styles.Relationship}>
        <span className={styles.RelationshipInput}>
          <input
            style={{marginBottom: "0px", border: "0px", width: "200px"}}
            type='text'
            placeholder='Relationship'
          />
          </span>
      </div>

      <div className={styles.submitButton}>
          <a href="createpassword">
          <button style={{color: "#e7404a", background: "white", border: "none"}}> <b>Submit Form</b> </button>
          </a>
      </div>

    </div>
  )
}