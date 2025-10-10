"use client";
import { Flex, Modal } from "antd";
import { MainTitle, Subtitle } from "./Titulo";
import { useAlertsModalStore } from "@/shared/stores/alertStore";

export default function AlertModal() {
  const { isOpen, closeAlert, message, type, onOkCallback } =
    useAlertsModalStore();

  const handleOk = () => {
    if (onOkCallback) {
      onOkCallback();
    }
    closeAlert();
  };

  const close = () => {
    closeAlert();
  };
  return (
    <>
      <Modal
        open={isOpen}
        onOk={handleOk}
        onCancel={close}
        centered
        maskClosable={false}
        keyboard={false}
        closable={false}
        width={900}
        style={{
          border: type === "error" ? "5px solid red" : "5px solid #FAB627",
          padding: 0,
          borderRadius: 10,
        }}
        title={
          <>
            <MainTitle>
              <Flex gap={10} align="center" justify="center">
                {type === "sure" && (
                  <>⚠️¿Estás seguro de tomar esta decisión?⚠️</>
                )}

                {type === "error" && <>🚨 Hay un error 🚨</>}

                {type === "warning" && <>⚠️Alerta del sistema ⚠️</>}
              </Flex>
            </MainTitle>
          </>
        }
        destroyOnHidden
        cancelButtonProps={{
          style: {
            display: type === "sure" ? "inline" : "none",
            height: 50,
            width: 180,
          },
        }}
        okButtonProps={{
          style: {
            backgroundColor: type === "error" ? "red" : "#FAB627",
            borderColor: type === "error" ? "red" : "#FAB627",
            fontWeight: "bold",
            height: 50,
            width: 180,
            marginLeft: 80,
          },
        }}
        okText={type === "sure" ? "Sí, dale" : "Ok, sí, entiendo"}
        cancelText={type === "sure" ? "No, déjalo así" : ""}
      >
        <div>
          <Flex
            justify="center"
            align="center"
            gap={20}
            style={{ marginTop: 50 }}
          >
            <Subtitle>{message}</Subtitle>
          </Flex>
        </div>
      </Modal>
    </>
  );
}
