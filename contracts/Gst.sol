pragma solidity ^0.5.1;
pragma experimental ABIEncoderV2;

contract Gst {
    uint256 public userCount = 2000;
    uint256 public billCount = 100;
    mapping(address => Users) public usersMap;
    mapping(uint256 => Bill) public billMap;
    mapping(address => Government) public governmentMap;

    struct Government {
        address payable addr;
        string govType;
    }

    struct Users {
        uint256 id;
        address payable addr;
        string firstName;
        string lastName;
        string email;
        string gstNumber;
        string userType;
    }

    struct Bill {
        uint256 id;
        address receiverAddress;
        string materialSelected;
        string beforeGstAmount;
        string afterGstAmount;
        string[] gstAmount;
        string gstPercent;
        bool paid;
        address billIssuer;
    }

    event GovernmentAccountCreated (
        address payable addr,
        string govType
    );

    event BillCreated (
        uint256 id,
        address receiverAddress,
        string materialSelected,
        string beforeGstAmount,
        string afterGstAmount,
        string[] gstAmount,
        string gstPercent,
        bool paid,
        address billIssuer
    );

    event AccountCreated(
        uint256 id,
        address payable addr,
        string firstName,
        string lastName,
        string email,
        string gstNumber,
        string userType
    );
    event BillPaid(
        uint256 id,
        address receiverAddress,
        string materialSelected,
        string beforeGstAmount,
        string afterGstAmount,
        string[] gstAmount,
        string gstPercent,
        address billIssuer
    );

    function createGovernmentAccount(address payable _addr, string memory _govType) public {
        governmentMap[_addr] = Government(_addr, _govType);
        emit GovernmentAccountCreated(_addr, _govType);
    }

    function createAccount(
        string memory _firstName,
        string memory _lastname,
        string memory _email,
        string memory _gstNumber,
        string memory _userType
        )
        public {
            userCount ++;

            usersMap[msg.sender] = Users(
                userCount,
                msg.sender,
                _firstName,
                _lastname,
                _email,
                _gstNumber,
                _userType
                );

            emit AccountCreated(
                userCount,
                msg.sender,
                _firstName,
                _lastname,
                _email,
                _gstNumber,
                _userType
                );
    }

    function generateBill(
        address _receiverAddress,
        string memory _materialSelected,
        string memory _beforeGstAmount,
        string memory _afterGstAmount,
        string[] memory _gstAmount,
        string memory _gstPercent,
        address _billIssuer
        )
        public {
            billCount ++;

            billMap[billCount] = Bill(
                billCount,
                _receiverAddress,
                _materialSelected,
                _beforeGstAmount,
                _afterGstAmount,
                _gstAmount,
                _gstPercent,
                false,
                _billIssuer
                );

            emit BillCreated(
                billCount,
                _receiverAddress,
                _materialSelected,
                _beforeGstAmount,
                _afterGstAmount,
                _gstAmount,
                _gstPercent,
                false,
                _billIssuer
                );
    }

    function transferAmountToUser(address _receiver) public payable {
        usersMap[_receiver].addr.transfer(msg.value);
    }

    function transferAmountToSGST(address _sgstAddress) public payable {
        governmentMap[_sgstAddress].addr.transfer(msg.value);
    }

    function transferAmountToCGST(address _cgstAddress) public payable {
        governmentMap[_cgstAddress].addr.transfer(msg.value);
    }

    function gstAmountArray(uint256 _billId) public view returns(string[] memory) {
        return billMap[_billId].gstAmount;
    }
    function paidBill(uint256 _billID, bool _paidStatus) public {
        billMap[_billID].paid = _paidStatus;
    }
}