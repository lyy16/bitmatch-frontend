import React, { useEffect } from "react";
import EtchFlowPath from "@/components/EtchFlowPath";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  useSelector,
  selectWallter,
  WallterType,
  useDispatch,
  connectUnisat,
} from "@/lib/redux";
import { ConnectModal } from "@/components/Page/TopBar/ConnectButton";
import useModal from "@/hook/useModal";
import {
  getRunesList,
  fetchRuneSearchApi,
  fetchHasMintAmount,
} from "@/api/api";
import SelectIcon from "@/components/Svg/SelectIcon";

const SelectSvg: React.FC = () => {
  return (
    <div className="etch-selectIconBox">
      <SelectIcon width={20} fill="#6F6F76" />
    </div>
  );
};

const dropdownStyle = {
  "&& .MuiMenu-paper": {
    background: "transparent",
    paddingTop: "8px",
  },
  "&& .MuiList-root": {
    background: "#181B20",
    borderRadius: "12px",
    border: "2px solid #6F6F76",
    padding: 0,
    overflow: "hidden",
  },
  "&& .MuiMenuItem-root": {
    padding: "12px 20px",
    fontSize: "24px",
    color: "#DBDBDB",
    "&:hover": {
      backgroundColor: "#24272B",
      color: "#F7931A",
    },
  },
  "&& .MuiMenuItem-root.Mui-selected": {
    backgroundColor: "#24272B",
    color: "#F7931A",
  },
};

export default function Etching1(props: any) {
  const { handleBackData, from2To1Data } = props;
  const [rune, setRune] = React.useState("");
  const [runes, setRunes] = React.useState([]);
  const [runeNum, setRuneNum] = React.useState(0);
  const [runeErrorTip, setRuneErrorTip] = React.useState("");
  const [amount, setAamount] = React.useState("");
  const [amountErrorTip, setAmountErrorTip] = React.useState("");
  const [premineReceiveAddress, setPremineReceiveAddress] = React.useState("");
  const [premineReceiveAddressErrorTip, setPremineReceiveAddressErrorTip] =
    React.useState("");
  const [block, setBlock] = React.useState("");
  const [tx, setTx] = React.useState("");

  const {
    address,
    balance,
    status: connectStatus,
  } = useSelector(selectWallter);
  const dispatch = useDispatch();
  const [onConnect, onDismiss] = useModal(
    <ConnectModal
      onDismiss={() => onDismiss()}
      connect={(type: WallterType) => {
        dispatch(connectUnisat(type));
        onDismiss();
      }}
    ></ConnectModal>
  ); //钱包弹窗

  const handleRuneChange = (event: SelectChangeEvent) => {
    setRune(event.target.value);
    let runeVal = event.target.value;
    // 获取所需的tx和block数据
    fetchRuneSearchApi(runeVal.replaceAll('•', '')).then((res) => {
      let runeid =
        (res["result"]["rune"] && res["result"]["rune"]["runeid"]) || "0:0";
      setTx(runeid.split(":")[1]);
      setBlock(runeid.split(":")[0]);
      // 获取剩余可Mint数量
      // const premineNum = res["result"]["rune"]["premine"] || 0;
      // const capacityNum = res["result"]["rune"]["capacity"] || 0;
      // let totalNum = premineNum + capacityNum;
      fetchHasMintAmount(runeVal.replaceAll('•', '')).then((mres) => {
        const hasMintNum = mres["result"]["mintAmount"] || 0;
        // let renuNumShow = totalNum - hasMintNum;
        setRuneNum(hasMintNum);
      });
    });
  };
  const setAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    let amontValue = event.target.value;
    if (!rune) {
      setAmountErrorTip("Please check Rune");
      return;
    }
    if (
      amontValue &&
      (isNaN(Number(amontValue)) ||
        Number(amontValue) <= 0 ||
        Number(amontValue) % 1 !== 0 ||
        amontValue.indexOf(".") !== -1)
    ) {
      return;
    }
    if (Number(amontValue) > runeNum) {
      return;
    }
    setAamount(event.target.value);
  };
  const checkAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    let amontValue = event.target.value;
    if (
      isNaN(Number(amontValue)) ||
      Number(amontValue) <= 0 ||
      Number(amontValue) % 1 !== 0
    ) {
      setAmountErrorTip("Amount must be a positive integer");
      setAamount("");
      return;
    }
    setAmountErrorTip("");
  };
  const setPremineRecAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPremineReceiveAddress(event.target.value);
  };
  const checkPremineRecAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
    const premineAddressValue = event.target.value;
    if (!premineAddressValue) {
      setPremineReceiveAddressErrorTip("Please input Receive Address");
      return;
    }
    setPremineReceiveAddressErrorTip("");
  };

  const checkFormData = () => {
    if (!rune) {
      setRuneErrorTip("Please select Rune");
      return false;
    }
    if (runeErrorTip) {
      return false;
    }
    if (!amount) {
      setAmountErrorTip("Please input Amount");
      return false;
    }
    if (amountErrorTip) {
      return false;
    }
    if (!premineReceiveAddress) {
      setPremineReceiveAddressErrorTip("Please input Premine Receive Address");
      return false;
    }
    return true;
  };

  const assembleFormData = () => {
    const checkFormResult = checkFormData();
    if (!checkFormResult) {
      return;
    }
    let callbackData: any = {
      flowIndex: 2,
      rune,
      divisibility: 0,
      transferAmount: amount,
      premineReceiveAddress,
      block,
      tx: Number(tx),
    };

    handleBackData(callbackData);
  };

  useEffect(() => {
    if (address) {
      getRunesList(address).then((res) => {
        if (res["result"]["runes"].length > 0) {
          setRunes(res["result"]["runes"]);

          // 获取所需的tx和block数据
          let runeVal = res["result"]["runes"][0]["runeName"];
          setRune(runeVal);
          fetchRuneSearchApi(runeVal.replaceAll('•', '')).then((res) => {
            let runeid =
              (res["result"]["rune"] && res["result"]["rune"]["runeid"]) ||
              "0:0";
            setTx(runeid.split(":")[1]);
            setBlock(runeid.split(":")[0]);
            fetchHasMintAmount(runeVal.replaceAll('•', '')).then((mres) => {
              const hasMintNum = mres["result"]["mintAmount"] || 0;
              // let renuNumShow = totalNum - hasMintNum;
              setRuneNum(hasMintNum);
            });
          });
        }
      });

      setPremineReceiveAddress(address);
    }
  }, [address]);

  useEffect(() => {
    if (from2To1Data.rune) {
      setRune(from2To1Data.rune);
      setAamount(from2To1Data.transferAmount);
      setPremineReceiveAddress(from2To1Data.premineReceiveAddress);
    }
  }, [from2To1Data]);

  return (
    <div className="etch-blockBox">
      <EtchFlowPath flowType={1} flowName="transfer"></EtchFlowPath>
      <div className="etch-formBox">
        <div className="etch-formItemBox">
          <div className="etch-formTitleBox">
            <span className="etch-star">*</span>
            <span className="etch-itemTitle">Rune</span>
          </div>
          <div className="etch-inputBox1">
            <Select
              value={rune}
              displayEmpty
              IconComponent={SelectSvg}
              MenuProps={{
                sx: dropdownStyle,
              }}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return (
                    <span className="etch-selectDefaultVal">Select Rune</span>
                  );
                }

                return selected;
              }}
              onChange={handleRuneChange}
            >
              {runes.map((item: any, index: number) => {
                return (
                  <MenuItem value={item.runeName} key={index}>
                    {item.runeName}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
          <p className="etch-formErrorTip etch-formErrorTipMintRune">
            <span>{runeErrorTip}</span>
            {rune && (
              <span>
                {rune} only has {runeNum} left to transfer
              </span>
            )}
          </p>
        </div>
        <div className="etch-formItemBox">
          <div className="etch-formTitleBox">
            <span className="etch-star">*</span>
            <span className="etch-itemTitle">Amount</span>
          </div>
          <div className="etch-inputBox1">
            <input
              type="text"
              value={amount}
              onChange={setAmount}
              onBlur={checkAmount}
            />
          </div>
          <p className="etch-formErrorTip">{amountErrorTip}</p>
        </div>
        <div className="etch-formItemBox">
          <div className="etch-formTitleBox">
            <span className="etch-star">*</span>
            <span className="etch-itemTitle">Receive Address</span>
          </div>
          <div className="etch-inputBox1">
            <input
              type="text"
              placeholder="bc1p…"
              value={premineReceiveAddress}
              onChange={setPremineRecAdd}
              onBlur={checkPremineRecAdd}
            />
          </div>
          <p className="etch-formErrorTip">{premineReceiveAddressErrorTip}</p>
        </div>
      </div>

      <div className="etch-bottomBalanceBox">
        <span className="etch-balanceTxt">Balance</span>
        <span className="etch-balanceNum">{balance.confirmed / 1e8} BTC</span>
      </div>
      {address ? (
        <>
          {connectStatus === "loading" ? (
            <div className="etch-bottomBtn etch-bottomBtnLoading">
              Next
              <span className="etch-bottomBtnLoading"></span>
            </div>
          ) : (
            <div className="etch-bottomBtn" onClick={assembleFormData}>
              Next
            </div>
          )}
        </>
      ) : (
        <div className="etch-bottomBtn" onClick={onConnect}>
          Connect wallet
        </div>
      )}
    </div>
  );
}
