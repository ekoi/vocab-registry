export interface IFacetValue {
    key: string,
    doc_count: number
}

export interface ISearchValues {
    name: string,
    field: string,
    values: string[]
}

export interface ISearchObject {
    searchvalues: ISearchValues[],
    page: number,
    page_length: number,
    sortorder: string
}

export interface IFacetCandidate {
    facet: string,
    field: string,
    candidate: string
}

export interface ISendCandidate {
    (data: IFacetCandidate):void
}

export interface IFacetCandidate {
    facet: string,
    field: string,
    candidate: string
}

export interface IRemoveFacet {
    (field: string, value: string): void
}

export interface IResultItem {
    _id?: string,
    record: string,
    title: string,
    description: string,
    home: string,
    endpoint: string,
    license: string,
}

export interface IResultList {
    amount: number,
    pages: number,
    items: IResultItem[]
}

export interface IResetFacets {
    (): void
}
