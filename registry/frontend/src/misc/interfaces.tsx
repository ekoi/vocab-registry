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
    }[];
    recommendations: {
        publisher: string;
        rating: string | null;
    }[];
}

export interface VocabIndex {
    record: string;
    title: string;
    description: string;
}
