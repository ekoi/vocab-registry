export interface Vocab {
    id: string;
    title: string;
    description: string | null;
    license: string;
    versioningPolicy: string | null;
    sustainabilityPolicy: string | null;
    created: string;
    modified: string;
    locations: VocabLocation[];
    reviews: {
        id: string;
        rating: number;
        review: string;
        nickname: string | null;
        moderation: 'blocked' | 'quarantaine' | null;
        user: string;
    }[];
    usages: {
        count: number;
        outOf: number;
    };
    recommendations: VocabRecommendation[];
    summary: {
        namespace: {
            uri: string | null;
            prefix: string | null;
        },
        stats: VocabSummary;
        subjects: VocabSummary;
        predicates: VocabSummary;
        objects: VocabObjectSummary;
    } | null;
}

export interface VocabLocation {
    location: string;
    type: 'homepage' | 'endpoint';
    recipe: 'sparql' | 'skosmos' | 'rdf' | null;
}

export interface VocabRecommendation {
    publisher: string;
    rating: string | null;
}

export interface VocabSummary {
    count: number | null;
    stats: {
        uri: string | null;
        prefix: string | null;
        count: number | null;
    }[]
}

export interface VocabObjectSummary extends VocabSummary {
    classes: VocabSummary | null;
    literals: VocabSummary | null;
}

export interface VocabIndex {
    record: string;
    title: string;
    description: string;
}
