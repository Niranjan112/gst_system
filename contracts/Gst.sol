pragma solidity ^0.5.0;

contract Gst {
    uint256 public userCount = 0;
    mapping(address => Users) public usersMap;
    struct Users {
        address payable addr;
        string firstName;
        string lastName;
        string email;
        string gstNumber;
        string userType;
    }

    event AccountCreated(
        address payable addr,
        string firstName,
        string lastName,
        string email,
        string gstNumber,
        string userType
    );

    function createAccount(
        string memory _firstName,
        string memory _lastname,
        string memory _email,
        string memory _gstNumber,
        string memory _userType
        )
        public {
            userCount ++;
            usersMap[msg.sender] = Users(msg.sender, _firstName, _lastname, _email, _gstNumber, _userType);
            emit AccountCreated(msg.sender, _firstName, _lastname, _email, _gstNumber, _userType);
    }

    function test(address _receiver) public payable{
        usersMap[_receiver].addr.transfer(msg.value);
    }

    function transferAmount(address _receiverAddress) public payable {
        require(
            usersMap[msg.sender].addr == msg.sender && 
            keccak256(abi.encodePacked((usersMap[msg.sender].userType)))  == keccak256(abi.encodePacked(('wholeseller'))) && 
            keccak256(abi.encodePacked((usersMap[_receiverAddress].userType)))  == keccak256(abi.encodePacked(('merchant')))
        );
            usersMap[_receiverAddress].addr.transfer(msg.value);
    }
}