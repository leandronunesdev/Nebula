"use client";

import React, { useEffect, useRef, useState } from "react";
import FooterBar from "../components/footer/footer-bar";
import QrCodeImage from "public/qr-code 2.png";
import tw, { css, styled } from "twin.macro";
import Image from "next/image";
import lottie from "lottie-web/build/player/lottie_light";
import congratulation from "public/congratulation.json";
import { Database } from "@tableland/sdk";
import { Wallet, getDefaultProvider } from "ethers";

interface Props {
  isSuccess: boolean;
}

export const CreateTransaction = ({ isSuccess }: Props) => {
  const warpperRef = useRef<HTMLDivElement>(null);

  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    if (!warpperRef.current) return;
    if (!isSuccess) return;
    lottie.loadAnimation({
      container: warpperRef.current,
      renderer: "svg",
      loop: false,
      autoplay: true,
      animationData: congratulation,
    });

    return () => {
      lottie.destroy();
    };
  }, [warpperRef, isSuccess]);

  const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
  const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

  const wallet = privateKey ? new Wallet(privateKey) : null;
  const provider = getDefaultProvider(`https://polygon-mumbai.g.alchemy.com/v2/${alchemyKey}`);
  const signer = wallet ? wallet.connect(provider) : null;
  const db = new Database({ signer: signer ?? undefined });

  const tableName: string = "nebula_test_80001_7883";
  const str = "hello world";
  const blob = new Blob(["type1", "type2"], {
    type: "text/plain",
  });

  const writeOnTable = async () => {
    // Insert a row into the table
    const { meta: insert } = await db
      .prepare(`INSERT INTO ${tableName} (test_text) VALUES (?);`)
      .bind("test2")
      .run();

    // Wait for transaction finality
    await insert.txn?.wait();

    // Perform a read query, requesting all rows from the table
    const { results } = await db.prepare(`SELECT * FROM ${tableName};`).all();
  };

  const getCurrentDate = () => {
    const today = new Date();
  const year = String(today.getFullYear()).slice(-2); 
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0"); 
    return `${year}/${month}/${day}`;
  };

  useEffect(() => {
    if (isSuccess) {
      setCurrentDate(getCurrentDate());
    }
  }, [isSuccess]);

  return (
    <>
      <Wrapper>
        <button onClick={writeOnTable}>Write on table</button>
        <QrWrapper>
          <QrTitle>Create Qr Code</QrTitle>
          <QrImage src={QrCodeImage} alt="qr-code-image" />
          <Qrpreview>QR Preview</Qrpreview>
        </QrWrapper>
        <BolderBox>
          <LeftCircle />
          <DotBolder />
          <RightCircle />
        </BolderBox>
        <TransactionWrapper>
          <TransactionBox>
            <TransactionContentBox>
              <TransactionTitle>Name</TransactionTitle>
              <TransactionContent>LeeDoYun</TransactionContent>
            </TransactionContentBox>
            <TransactionContentBox>
              <TransactionTitle>Date</TransactionTitle>
              <TransactionContent>{currentDate}</TransactionContent>
            </TransactionContentBox>
            <TransactionContentBox>
            <TransactionTitle>Token</TransactionTitle>
            <TransactionContent>0</TransactionContent>
            </TransactionContentBox>
            <TransactionContentBox>
              <TransactionTitle>Amount</TransactionTitle>
              <TransactionContent>0</TransactionContent>
            </TransactionContentBox>
            <TransactionContentBox>
              <TransactionTitle>Gas Fee</TransactionTitle>
              <TransactionContent>0</TransactionContent>
            </TransactionContentBox>
            <TransactionContentBox>
              <TransactionTitle>Validity</TransactionTitle>
              <TransactionContent>1hour</TransactionContent>
            </TransactionContentBox>
          </TransactionBox>
          <SaveBox>
            <SaveText>Save</SaveText>
          </SaveBox>
        </TransactionWrapper>
      </Wrapper>
      <FooterBarBox>
        <FooterBar />
      </FooterBarBox>
    </>
  );
};

const Wrapper = styled.div(() => [
  tw`
    flex flex-col h-full
    items-center justify-center 
    overflow-y-auto mt-24
`,
]);

const FooterBarBox = tw.div`
  absolute bottom-0 w-full
`;

const QrWrapper = tw.div`
  flex-center flex-col w-328 h-300 h-1/2 bg-gray7
  rounded-t-20 gap-27
`;

const QrTitle = tw.div`
  font-r-16 text-gray3
`;

const Qrpreview = tw.div`
  font-sb-14 text-white
`;

const QrImage = tw(Image)`
  w-200
`;

const BolderBox = tw.div`
  flex relative
`;

const DotBolder = tw.div`
 flex w-328 border-dotted border-b-2 border-gray7
`;

const LeftCircle = tw.div`
  absolute top-[-6px] left-[-8px] w-16 h-16 rounded-full bg-gray8
`;

const RightCircle = tw.div`
absolute top-[-6px] right-[-8px] w-16 h-16 rounded-full bg-gray8
`;

const TransactionWrapper = tw.div`
  flex-center flex-col  h-380 rounded-b-20
  bg-[#282833] w-328 p-24
`;

const TransactionContentBox = tw.div`
  flex-center justify-between  w-full h-full
  gap-20 p-6
`;

const TransactionBox = styled.div(() => [
  tw`
    flex-center flex-col w-full h-280
    bg-gray2 rounded-20 py-16 px-20
`,
  css`
    border-radius: 16px;
    border: 1px solid #cfcffc5c;
    background: rgba(78, 78, 97, 0.2);
    backdrop-filter: blur(5px);
  `,
]);

const SaveBox = styled.div(() => [
  tw`
    flex-center flex-col w-full h-50
    bg-gray2 rounded-20 py-16 px-20
`,
  css`
    border-radius: 30px;
    border: 1px solid #cfcffc5c;
    background: rgba(78, 78, 97, 0.2);
    backdrop-filter: blur(5px);
    margin-top: 35px;
    position: relative;
  `,
]);

const SaveText = tw.div`
  text-white font-bold
`;

const TransactionTitle = tw.div`
  font-sb-14 text-white
`;

const TransactionContent = tw.div`
  font-r-12 text-gray3
`;