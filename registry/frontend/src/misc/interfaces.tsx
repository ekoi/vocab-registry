export interface Vocab {
    id: string;
    title: string;
    description: string | null;
    license: string;
    versioningPolicy: string | null;
    sustainabilityPolicy: string | null;
    created: string;
    modified: string;
    locations: {
        location: string;
        type: 'homepage' | 'endpoint' | 'dump';
        recipe: 'sparql' | 'skosmos' | null;
    }[];
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
    recommendations: {
        publisher: string;
        rating: string | null;
    }[];
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

export interface VocabSummary {
    count: number | null;
    stats: {
        uri: string | null;
        prefix: string | null;
        count: number | null;
    }
}

export interface VocabObjectSummary extends VocabSummary {
    classes: VocabSummary;
    literals: VocabSummary;
}

export interface VocabIndex {
    record: string;
    title: string;
    description: string;
}
