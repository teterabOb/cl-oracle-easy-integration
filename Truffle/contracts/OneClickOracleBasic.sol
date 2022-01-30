//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

import "./interfaces/AggregatorV2V3Interface.sol";
import "./interfaces/ITrustedCaller.sol";

contract OneClickOracleBasic {
    int256 private immutable exp_base = 10;
    int8 private immutable base_decimals = 18;
    int8 private idOracles;
    uint32 private min_len_name = 4;
    uint32 private max_len_name = 12;
    bool private contract_paused = false;
    address private owner;
    ITrustedCaller private trustedCaller;

    struct Oracle {
        int8 id;
        string name;
        address token;
        address priceFeed;
        bool state;
    }

    Oracle[] oracles;

    //Mappings
    mapping(address => address) tokenPriceFeedMapping;
    mapping(int8 => Oracle) OraclesMapping;

    //Events
    event priceFeedAdded(address indexed _token, address indexed _priceFeed);
    event priceFeedUpdated(Oracle indexed _Oracle);
    event newOwner(address indexed _newOwner);

    constructor(address _owner, address _trustedCallerContract) {
        owner = _owner;
        trustedCaller = ITrustedCaller(_trustedCallerContract);
    }

    function addOracle(
        string memory _name,
        address _token,
        address _priceFeed,
        bool _state
    ) public onlyOwner {
        require(isValidName(_name) == true, "Invalid name");
        Oracle memory oracle = Oracle(
            idOracles + 1,
            _name,
            _token,
            _priceFeed,
            _state
        );
        _addTokenToPriceFeed(oracle);
    }

    function getOracles() public view returns (Oracle[] memory) {
        return oracles;
    }

    function getHistoricalPrice(address _token, uint256 _roundId)
        public
        view
        validPriceFeed(_token)
        returns (int256)
    {
        AggregatorV2V3Interface priceFeed = _getAggregatorV2V3Interface(_token);
        return priceFeed.getAnswer(_roundId);
    }

    function _addTokenToPriceFeed(Oracle memory _oracle) internal {
        require(isValidOracle(_oracle) == true, "Must be valid Oracle");
        tokenPriceFeedMapping[_oracle.token] = _oracle.priceFeed;
        OraclesMapping[_oracle.id] = _oracle;
        oracles.push(_oracle);
        idOracles++;
        emit priceFeedAdded(_oracle.token, _oracle.priceFeed);
    }

    function updateOracle(Oracle memory _oracle)
        public
        isIntegrated(_oracle.id)
        onlyOwner
    {
        tokenPriceFeedMapping[_oracle.token] = _oracle.priceFeed;
        OraclesMapping[_oracle.id] = _oracle;
        oracles[uint256(int256(_oracle.id)) - 1] = _oracle;
        emit priceFeedUpdated(_oracle);
    }

    function getOracleById(int8 _id) public view returns (Oracle memory) {
        return OraclesMapping[_id];
    }

    function isValidOracle(Oracle memory _oracle) public view returns (bool) {
        if (
            _oracle.token != address(0) &&
            _oracle.priceFeed != address(0) &&
            _oracle.id == (idOracles + 1)
        ) {
            return true;
        } else {
            return false;
        }
    }

    function isValidName(string memory _text) public view returns (bool) {
        bytes memory auxText = bytes(_text);
        if (auxText.length >= min_len_name && auxText.length <= max_len_name) {
            return true;
        } else {
            return false;
        }
    }

    //@Token lindes address
    function getOraclePrice(address _token)
        public
        view
        validPriceFeed(_token)
        onlyTrustedCaller
        contractPaused
        returns (int256)
    {
        int256 price = _getConvertPrice(_token);
        uint8 decimals = getDecimalsOfPriceFeed(_token);
        require(
            _validDecimals(decimals) == true && decimals > 0,
            "invalid decimals"
        );
        int256 finalPrice = price * exp_base**(18 - decimals);
        require(finalPrice > 0, "Final price not valid");
        return finalPrice;
    }

    function getDecimalsOfPriceFeed(address _token)
        public
        view
        validPriceFeed(_token)
        returns (uint8)
    {
        return _getAggregatorV2V3Interface(_token).decimals();
    }

    function getLatestAnswer(address _token)
        public
        view
        validPriceFeed(_token)
        returns (int256)
    {
        return _getAggregatorV2V3Interface(_token).latestAnswer();
    }

    function pauseContract(bool _state) public onlyOwner returns (bool) {
        contract_paused = _state;
        return contract_paused;
    }

    function _getConvertPrice(address _token) internal view returns (int256) {
        int256 price = int256(getLatestAnswer(_token));
        return price;
    }

    function _validDecimals(uint8 _decimals) internal pure returns (bool) {
        if (18 - _decimals <= 18) return true;
        else return false;
    }

    ///Interfaces helper for redundant Code
    function _getAggregatorV2V3Interface(address _token)
        private
        view
        returns (AggregatorV2V3Interface)
    {
        address priceFeedAddress = tokenPriceFeedMapping[_token];
        AggregatorV2V3Interface aggregator = AggregatorV2V3Interface(
            priceFeedAddress
        );

        return aggregator;
    }

    function getTrustedCallerIAddress() public view returns (address) {
        return address(trustedCaller);
    }

    function getPriceFeedByToken(address _token)
        public
        view
        validPriceFeed(_token)
        returns (address)
    {
        return tokenPriceFeedMapping[_token];
    }

    function _isValidPriceFeed(address _token) internal view returns (bool) {
        if (tokenPriceFeedMapping[_token] != address(0)) {
            return true;
        } else {
            return false;
        }
    }

    function changeOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }

    function _isIntegrated(int8 _id) internal view returns (bool) {
        Oracle memory oracle = OraclesMapping[_id];
        if (oracle.id > 0) return true;
        else return false;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function getOraclelength() public view returns (int8) {
        return idOracles;
    }

    //Modifiers
    modifier isIntegrated(int8 _id) {
        require(_isIntegrated(_id), "Not integrated");
        _;
    }

    modifier validPriceFeed(address _token) {
        require(_token != address(0), "No Address 0");
        require(_isValidPriceFeed(_token), "Not valid token");
        _;
    }

    modifier contractPaused() {
        require(!contract_paused, "Contract Paused");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Owner");
        _;
    }

    modifier onlyTrustedCaller() {
        require(
            trustedCaller.isTrustedCaller(msg.sender),
            "Only trusted caller"
        );
        _;
    }
}
