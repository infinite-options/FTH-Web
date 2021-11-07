import styles from "../Items/items.module.css";
import { ReactComponent as ModalCloseBtn } from "../../../images/ModalCloseRed.svg";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { useEffect, useReducer, useState, useRef } from "react";
import axios from "axios";
import { API_URL } from "../../../reducers/constants";
import AddTags from '../Modals/AddTags';

const AddDonor = (props) => {

  const [newItem, setNewItem] = useState({
    item_name: "",
    item_desc: "",
    item_type: "",
    item_tags: [],
  });
  const [itemTypeList, setItemTypeList] = useState(null);
  const [itemTagList, setItemTagList] = useState(null);

  useEffect(() => {
    console.log("itemTagList: ", itemTagList);
  }, [itemTagList])

  // set once all data fetched
  const [dataFetched, setDataFetched] = useState(false);

  const getItemTags = () => {
    axios
      .get(`${API_URL}get_tags_list`)
      .then((response) => {
        const tagRes = response.data.result;
        const tagsList = tagRes.map((tag) => {
          const tagItem = {
            tag_name: tag.tags,
            active: newItem.item_tags.includes(tag.tags) ? 1 : 0,
          };
          return tagItem;
        });
        // dispatch({ type: "GET_ITEM_TAG_LIST", payload: tagsList });
        setItemTagList(tagsList);
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

  useEffect(() => {
    getItemTags();
    getItemTypes();
  }, []);

  useEffect(() => {
    setDataFetched(true);
  }, [itemTypeList, itemTagList]);

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
      console.log("appending: ", newItem);
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
          props.toggleAddItem(true);
        }
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };

  const toggleItemTag = (itemIndex) => {
    console.log("clicked ", itemIndex);
    const updatedItemTags = [...itemTagList];
    updatedItemTags[itemIndex].active
      ? (updatedItemTags[itemIndex].active = 0)
      : (updatedItemTags[itemIndex].active = 1);
    // dispatch({ type: "GET_ITEM_TAG_LIST", payload: updatedItemTags });
    setItemTagList(updatedItemTags);
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
        {dataFetched && (
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
            overflow: "auto",
            maxHeight: "90%",
          }}
        >
          {/* {console.log("redndering here")} */}
          <div style={{ textAlign: "right", padding: "10px" }}>
            <ModalCloseBtn
              onClick={() => props.toggleAddDonor()}
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
            <Modal.Title style={{ fontWeight: "bold" }}>Donor</Modal.Title>
            <Modal.Body>
              <div className={styles.modalContainerVertical}>
                <div className={styles.modalContainerHorizontal}>
                  <div className={styles.modalFormLabel}>First Name</div>
                  <input
                    className={styles.modalInput}
                    value={newItem.item_name}
                    onChange={(event) =>
                      editNewItem("item_name", event.target.value)
                    }
                    style={{ width: "220px" }}
                  />
                </div>
                <div className={styles.modalContainerHorizontal}>
                  <div className={styles.modalFormLabel}>Last Name</div>
                  <input
                    className={styles.modalInput}
                    value={newItem.item_name}
                    onChange={(event) =>
                      editNewItem("item_name", event.target.value)
                    }
                    style={{ width: "220px" }}
                  />
                </div>
                <div className={styles.modalContainerHorizontal}>
                  <div className={styles.modalFormLabel}>
                    Phone Number
                  </div>
                  <input
                    className={styles.modalInput}
                    value={newItem.item_desc}
                    onChange={(event) =>
                      editNewItem("item_desc", event.target.value)
                    }
                    style={{ width: "220px" }}
                  />
                </div>
                <div className={styles.modalContainerHorizontal}>
                  <div className={styles.modalFormLabel}>
                    Email Address
                  </div>
                  <input
                    className={styles.modalInput}
                    value={newItem.item_desc}
                    onChange={(event) =>
                      editNewItem("item_desc", event.target.value)
                    }
                    style={{ width: "220px" }}
                  />
                </div>
                <div className={styles.modalContainerHorizontal}>
                <span className={styles.modalFormLabel}>
                    Address
                  </span>
                  <div className={styles.addressContainer}>
                    <input
                      className={styles.modalAddressInput}
                      value={newItem.item_desc}
                      onChange={(event) =>
                        editNewItem("item_desc", event.target.value)
                      }
                      style={{ width: "360px" }}
                      placeholder="Address Line 1"
                    /><br/>
                    <input
                      className={styles.modalAddressInput}
                      value={newItem.item_desc}
                      onChange={(event) =>
                        editNewItem("item_desc", event.target.value)
                      }
                      style={{ width: "360px" }}
                      placeholder="Address Line 2"
                    /><br/>
                    <input
                      className={styles.modalAddressInput}
                      value={newItem.item_desc}
                      onChange={(event) =>
                        editNewItem("item_desc", event.target.value)
                      }
                      style={{ width: "200px" }}
                      placeholder="City"
                    />
                    <input
                      className={styles.modalAddressInput}
                      value={newItem.item_desc}
                      onChange={(event) =>
                        editNewItem("item_desc", event.target.value)
                      }
                      style={{ width: "60px" }}
                      placeholder="State"
                    />
                    <input
                      className={styles.modalAddressInput}
                      value={newItem.item_desc}
                      onChange={(event) =>
                        editNewItem("item_desc", event.target.value)
                      }
                      style={{ width: "80px" }}
                      placeholder="Zipcode"
                    />
                  </div>
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
                Add Donor
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
      )}
      </div>
      {props.showAddItemTags && (
        <AddTags
          toggleAddItemTags={props.toggleAddItemTags}
          toggleItemTag={toggleItemTag}
          showAddItemTags={props.showAddItemTags}
          editNewItem={editNewItem}
          newItem={newItem}
          itemTagList={itemTagList}
          setItemTagList={setItemTagList}
        />
      )}
    </>
  )
}
  
export default AddDonor;