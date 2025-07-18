'use client'
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { Input, Space } from "antd";
import { Hits, InstantSearch, PoweredBy, SearchBox } from "react-instantsearch";

export default function ProductSearch() {
  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
    process.env.NEXT_PUBLIC_ALGOLIA_API_KEY!
  );

  function Hit({ hit }: any) {
    return (
      <article>
        {/* <img src={hit.image} alt={hit.NOMBRE} /> */}
        <h1>{hit.NOMBRE}</h1>
        <p>{hit.MARCA}</p>
      </article>
    );
  }

  return (
    <>
        <Space style={{width: '50%'}}>
            <Input placeholder="search"/>
        </Space>
      {/* <InstantSearch searchClient={searchClient} indexName="csvjson">
        <SearchBox />
        <PoweredBy />
        <Hits hitComponent={Hit} />
      </InstantSearch> */}
    </>
  );
}
