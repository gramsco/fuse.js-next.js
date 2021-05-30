import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Fuse from "fuse.js";
import axios from "axios";
import { useEffect, useState } from "react";

const options = {
  includeScore: true,
};

const ARTICLES_ENDPOINT = process.env.NEXT_PUBLIC_ARTICLES_ENDPOINT;

export async function getStaticProps() {
  const articles = await axios.get(ARTICLES_ENDPOINT).then((res) => res.data);

  const onlyTitlesSlug = articles.map(({ title, slug }) => ({
    title,
    slug,
  }));
  const index = Fuse.createIndex(["title", "tags"], onlyTitlesSlug).toJSON();
  return {
    props: {
      onlyTitlesSlug,
      articles,
      index,
    },
  };
}

export default function Home({ onlyTitlesSlug, articles, index }) {
  index = Fuse.parseIndex(index);
  const [value, setValue] = useState("");
  const [result, setResult] = useState({});

  const fuse = new Fuse(onlyTitlesSlug, options, index);

  function handleChange({ target: { value } }) {
    setValue(value);
  }

  useEffect(() => {
    if (value === "") {
      setResult({});
      return;
    }
    const result = fuse.search(value);
    setResult(result);
  }, [value]);

  return (
    <div>
      <input value={value} onChange={handleChange} />
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
