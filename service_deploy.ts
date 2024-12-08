import { ethers } from "ethers";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

// Configuración de la red
const ARBITRUM_RPC = process.env.ARBITRUM_RPC!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;

async function deployContract() {
  const provider = new ethers.JsonRpcProvider(ARBITRUM_RPC);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  // Cargar el contrato WASM
  const contractWasm = fs.readFileSync("./AddContract.wasm");

  console.log("Desplegando contrato...");
  // Crear una transacción para desplegar el contrato
  const tx = await wallet.sendTransaction({
    data: contractWasm, // El código WASM del contrato
  });

  const receipt = await tx.wait();
  console.log("Contrato desplegado en:", receipt.contractAddress);

  return receipt.contractAddress;
}

async function interactWithContract(contractAddress: string) {
  const provider = new ethers.JsonRpcProvider(ARBITRUM_RPC);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  // Interactuar con el contrato (ejemplo de llamada)
  console.log("Llamando a la función `add`...");
  const tx = await wallet.sendTransaction({
    to: contractAddress,
    data: "0x1234...", // Reemplaza con los datos de la función codificados en ABI
  });

  const receipt = await tx.wait();
  console.log("Resultado de la transacción:", receipt);
}

(async () => {
  const contractAddress = await deployContract();
  await interactWithContract(contractAddress);
})();
