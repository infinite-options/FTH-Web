import styles from "../Items/items.module.css";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { useEffect, useReducer, useState, useRef } from "react";

function AddTags(props) {

  const [itemTagList, setItemTagList] = useState([]);

  const saveItemTags = () => {
    // get all item tags that are active and add to newItem.item_tags
    const activeItemTags = [];
    itemTagList.forEach((itemTag) => {
      if (itemTag.active === 1) {
        activeItemTags.push(itemTag.tag_name);
      }
    });
    props.editNewItem("item_tags", activeItemTags);
    props.toggleAddItemTags();
  };

    return (
      <div
      style={{
        height: "100%",
        width: "100%",
        zIndex: "101",
        left: "0",
        top: "0",
        // overflow: "auto",
        position: "fixed",
        display: "grid",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
      }}
    >
        <div
          style={{
            height: "100%",
            width: "100%",
            zIndex: "101",
            left: "0",
            top: "0",
            position: "fixed",
            display: "grid",
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
              overflow: "auto",
            }}
          >
            <div
              style={{
                border: "none",
                paddingLeft: "15px",
                fontWeight: "bold",
              }}
            >
              <Modal.Title style={{ fontWeight: "bold" }}>
                Select Item tags to add
              </Modal.Title>
              <Modal.Body>
                <div style={{ maxWidth: "300px" }}>
                  {itemTagList &&
                    itemTagList.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className={
                            item.active
                              ? styles.itemTagSelected
                              : styles.itemTagNotSelected
                          }
                          onClick={() => props.toggleItemTag(index)}
                        >
                          {item.tag_name}
                        </div>
                      );
                    })}
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
                  className={styles.whiteButton}
                  onClick={() => saveItemTags()}
                >
                  Add Meal Tags
                </button>
              </Modal.Footer>
            </div>
          </div>
        </div>
      </div>
    )
}

export default AddTags;