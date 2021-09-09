<div
  style={{
    height: "100%",
    width: "100%",
    zIndex: "101",
    left: "0",
    top: "0",
    overflow: "auto",
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
    }}
  >
    <div style={{ textAlign: "right", padding: "10px" }}>
      <ModalCloseBtn style={{ cursor: "pointer" }} />
    </div>
    <div
      style={{
        border: "none",
        paddingLeft: "15px",
        fontWeight: "bold",
      }}
    >
      <Modal.Title style={{ fontWeight: "bold" }}>Modal Title</Modal.Title>
      <Modal.Body>Modal Body</Modal.Body>
      <Modal.Footer
        style={{
          border: "none",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <button className={styles.redButton}>Add Item</button>
        <button className={styles.whiteButton}>Cancel</button>
      </Modal.Footer>
    </div>
  </div>
</div>;
