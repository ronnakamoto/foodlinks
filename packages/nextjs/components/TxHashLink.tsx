const TxHashLink = ({ txHash }: any) => {
  const shortenHash = (hash: string) => {
    return hash.slice(0, 6) + "..." + hash.slice(-4);
  };

  const ETHERSCAN_URL_PREFIX = `https://mumbai.polygonscan.com/tx/`;
  console.log("ETHERSCAN_URL_PREFIX: ", ETHERSCAN_URL_PREFIX);

  return (
    <div>
      <span>🔗 </span>
      <span>
        <a
          href={`${ETHERSCAN_URL_PREFIX}${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          {shortenHash(txHash)}
        </a>
      </span>
    </div>
  );
};

export default TxHashLink;
