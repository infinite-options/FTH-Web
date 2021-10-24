import styles from "../Items/items.module.css";
import { ReactComponent as ModalCloseBtn } from "../../../images/ModalCloseRed.svg";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { useEffect, useReducer, useState, useRef } from "react";
import axios from "axios";
import { API_URL } from "../../../reducers/constants";
import AddTags from '../Modals/AddTags';

const AddItem = (props) => {

  const [newItem, setNewItem] = useState({
    item_name: "",
    item_desc: "",
    item_type: "",
    item_tags: [],
  });
  const [itemTypeList, setItemTypeList] = useState([]);

  useEffect(() => {
    // getSupplyItems();
    getItemTypes();
  }, []);

  const editNewItem = (field, value) => {
    const updatedItem = {
      ...newItem,
      [field]: value,
    };
    // dispatch({ type: "EDIT_NEW_ITEM", payload: updatedItem });
    setNewItem(updatedItem);
  };

  const postNewItem = () => {
    const itemFormData = new FormData();

    for (const field of Object.keys(newItem)) {
      itemFormData.append(field, newItem[field]);
    }

    axios
      .post(`${API_URL}add_items`, itemFormData)
      .then((response) => {
        console.log("add_items res: ", response);
        if (response.status === 200) {
          // dispatch({ type: "EDIT_NEW_ITEM", payload: initialState.newItem });
          setNewItem({
            item_name: "",
            item_desc: "",
            item_type: "",
            item_tags: [],
          });
          props.toggleAddItem();
        }
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };

  const getItemTypes = () => {
    axios
      .get(`${API_URL}get_types_list`)
      .then((response) => {
        const typesList = response.data.result;
        console.log("get_types_list res: ", typesList);
        // dispatch({ type: "GET_ITEM_TYPE_LIST", payload: typesList });
        setItemTypeList(typesList);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };

  return (
    <>
    <div
        style={{
          height: "100%",
          width: "100%",
          zIndex: "101",
          left: "0",
          top: "0",
          position: "fixed",
          display: "grid",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <div
          style={{
            position: "relative",
            justifySelf: "center",
            alignSelf: "center",
            display: "block",
            border: "2px solid #E7404A",
            backgroundColor: "white",
            height: "auto",
            width: "auto",
            zIndex: "102",
            padding: "10px 0px 10px 0px",
            borderRadius: "20px",
            overflow: "scroll",
            maxHeight: "90%",
          }}
        >
          <div style={{ textAlign: "right", padding: "10px" }}>
            <ModalCloseBtn
              onClick={() => props.toggleAddItem()}
              className={styles.closeBtn}
            />
          </div>
          <div
            style={{
              border: "none",
              paddingLeft: "15px",
              fontWeight: "bold",
            }}
          >
            <Modal.Title style={{ fontWeight: "bold" }}>Item</Modal.Title>
            <Modal.Body>
              <div className={styles.modalContainerVertical}>
                <div className={styles.modalContainerHorizontal}>
                  <div className={styles.modalFormLabel}>Item Name</div>
                  <input
                    className={styles.modalInput}
                    value={newItem.item_name}
                    onChange={(event) =>
                      editNewItem("item_name", event.target.value)
                    }
                    style={{ width: "220px" }}
                  ></input>
                </div>
                <div className={styles.modalContainerHorizontal}>
                  <div className={styles.modalFormLabel}>
                    Item Description
                  </div>
                  <input
                    className={styles.modalInput}
                    value={newItem.item_desc}
                    onChange={(event) =>
                      editNewItem("item_desc", event.target.value)
                    }
                    style={{ width: "220px" }}
                  ></input>
                </div>
                <div className={styles.modalContainerHorizontal}>
                  <div
                    // className={styles.modalFormLabel}
                    className={styles.modalFormLink}
                    onClick={() => {
                      props.toggleAddItemTags();
                    }}
                  >
                    Add Item Tags +
                  </div>
                  <div style={{ width: "260px", paddingLeft: "40px" }}>
                    {newItem &&
                      newItem.item_tags &&
                      newItem.item_tags.map((itemTag, index) => {
                        return (
                          <div key={index} className={styles.itemTagSelected}>
                            {itemTag}
                          </div>
                        );
                      })}
                  </div>
                </div>
                <div className={styles.modalContainerHorizontal}>
                  <div className={styles.modalFormLabel}>Type of Food</div>
                  <select
                    className={styles.modalDropdown}
                    onChange={(event) =>
                      editNewItem("item_type", event.target.value)
                    }
                    value={newItem.item_type}
                    style={{ width: "220px" }}
                  >
                    <option key="0" value="">
                      Select Type of Food
                    </option>
                    {itemTypeList &&
                      itemTypeList.map((type, index) => {
                        return (
                          <option key={index} value={type.types}>
                            {type.types}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer
              style={{
                border: "none",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <button
                className={styles.redButton}
                onClick={() => postNewItem()}
              >
                Add Item
              </button>
              <button
                className={styles.whiteButton}
                onClick={() => props.toggleAddItem()}
              >
                Cancel
              </button>
            </Modal.Footer>
          </div>
        </div>
      </div>
      {props.showAddItemTags && (
        <AddTags
          toggleAddItemTags={props.toggleAddItemTags}
          showAddItemTags={props.showAddItemTags}
          editNewItem={editNewItem}
          newItem={newItem}
        />
      )}
      </>
  )
}
  
export default AddItem;