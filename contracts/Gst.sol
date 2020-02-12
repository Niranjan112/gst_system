pragma solidity ^0.5.0;

contract Gst {
    uint256 public userCount = 0;
    mapping(uint256 => Users) public usersMap;
    struct Users {
        uint256 id;
        address payable addr;
        string firstName;
        string lastName;
        string email;
        string gstNumber;
        string userType;
    }

    event AccountCreated(
        uint256 id,
        address payable addr,
        string firstName,
        string lastName,
        string email,
        string gstNumber,
        string userType
    );

    function createAccount(
        uint256 _id,
        string memory _firstName,
        string memory _lastname,
        string memory _email,
        string memory _gstNumber,
        string memory _userType
    )
        public {
            userCount ++;
            usersMap[userCount] = Users(_id, msg.sender, _firstName, _lastname, _email, _gstNumber, _userType);
            emit AccountCreated(_id, msg.sender, _firstName, _lastname, _email, _gstNumber, _userType);
    }

    function test(uint256 _senderId) public payable{
        usersMap[_senderId].addr.transfer(msg.value);
    }

    function transferAmount(uint256 _senderId, uint256 _receiverId) public payable {
        if(keccak256(abi.encodePacked((usersMap[_senderId].userType)))  == keccak256(abi.encodePacked(('wholeseller'))) && keccak256(abi.encodePacked((usersMap[_receiverId].userType)))  == keccak256(abi.encodePacked(('merchant')))) {
            require(
            usersMap[_senderId].addr == msg.sender && 
            keccak256(abi.encodePacked((usersMap[_senderId].userType)))  == keccak256(abi.encodePacked(('wholeseller'))) && 
            keccak256(abi.encodePacked((usersMap[_receiverId].userType)))  == keccak256(abi.encodePacked(('merchant')))
            );
            usersMap[_receiverId].addr.transfer(msg.value);
        }
    }
}