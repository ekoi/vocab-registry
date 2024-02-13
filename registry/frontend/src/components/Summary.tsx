import {Vocab, VocabSummary, VocabSummaryListItem, VocabVersion} from '../misc/interfaces';

export default function Summary({data}: { data: Vocab }) {
    if (!data.summary)
        return <div>No summarized data available!</div>;

    const classesSummaryList = createListMapping(data.summary.objects.classes?.list || []);
    const predicatesSummaryList = createListMapping(data.summary.predicates?.list || []);
    const literalsSummaryList = createListMapping(data.summary.objects.literals?.list || []);

    return (
        <div className="fullWidth">
            <SummaryTable summary={data.summary}/>

            {Object.keys(classesSummaryList).length > 0 &&
                <SummaryListTable name="Class" summaryList={classesSummaryList}/>}
            {Object.keys(predicatesSummaryList).length > 0 &&
                <SummaryListTable name="Predicate" summaryList={predicatesSummaryList}/>}
            {Object.keys(literalsSummaryList).length > 0 &&
                <SummaryListTable name="Predicate" summaryList={literalsSummaryList}/>}

            {(data.summary.objects.literals?.languages || []).length > 0 &&
                <SummaryLanguagesTable languages={data.summary.objects.literals?.languages || []}/>}
        </div>
    );
}

function SummaryTable({summary}: { summary: VocabSummary }) {
    return (
        <>
            <h2>Vocabulary counts</h2>
            <table className="vocabSummary">
                <thead>
                <tr>
                    <th>Vocabulary</th>
                    <th>Subjects</th>
                    <th>Predicates</th>
                    <th colSpan={2}>Objects</th>
                    <th>Total</th>
                </tr>
                <tr>
                    <th colSpan={3}>&nbsp;</th>
                    <th>Classes</th>
                    <th>Literals</th>
                    <th>&nbsp;</th>
                </tr>
                </thead>

                <tbody>
                {summary.stats.stats.map(stat => (
                    <tr key={stat.prefix}>
                        <th>{stat.uri} <span className="pill">{stat.prefix}</span></th>
                        <td>{summary.subjects.stats.find(s => s.prefix === stat.prefix)?.count ?? 0}</td>
                        <td>{summary.predicates.stats.find(s => s.prefix === stat.prefix)?.count ?? 0}</td>
                        <td>{summary.objects.classes?.stats?.find(s => s.prefix === stat.prefix)?.count ?? 0}</td>
                        <td>{summary.objects.literals?.stats?.find(s => s.prefix === stat.prefix)?.count ?? 0}</td>
                        <td>{stat.count ?? 0}</td>
                    </tr>
                ))}
                </tbody>

                <tfoot>
                <tr>
                    <th className="footer-unique">Unique totals:</th>
                    <th>{summary.subjects.count ?? 0}</th>
                    <th>{summary.predicates.count ?? 0}</th>
                    <th>{summary.objects.classes?.count ?? 0}</th>
                    <th>{summary.objects.literals?.count ?? 0}</th>
                    <th>{summary.stats.count ?? 0}</th>
                </tr>
                </tfoot>
            </table>
        </>
    );
}

function SummaryListTable({name, summaryList}: {
    name: string;
    summaryList: { [prefix: string]: VocabSummaryListItem[] };
}) {
    return (
        <>
            <h2>{name} counts</h2>
            <table className="vocabSummary">
                <thead>
                <tr>
                    <th>Vocabulary</th>
                    <th>{name}</th>
                    <th>Total</th>
                </tr>
                </thead>

                <tbody>
                {Object.keys(summaryList).map(prefix => (
                    summaryList[prefix].map((item, idx) => (
                        <tr key={prefix + ':' + item.name}>
                            {idx === 0 && <th rowSpan={summaryList[prefix].length}>
                                {item.uri} <span className="pill">{item.prefix}</span>
                            </th>}
                            <td className="al-left">{item.name}</td>
                            <td>{item.count ?? 0}</td>
                        </tr>
                    ))
                ))}
                </tbody>
            </table>
        </>
    );
}

function SummaryLanguagesTable({languages}: {
    languages: {
        code: string;
        count: number;
    }[]
}) {
    return (
        <>
            <h2>Language counts</h2>
            <table className="vocabSummary">
                <thead>
                <tr>
                    <th>Language code</th>
                    <th>Total</th>
                </tr>
                </thead>

                <tbody>
                {languages.map(langItem => (
                    <tr key={langItem.code}>
                        <td>{langItem.code}</td>
                        <td>{langItem.count ?? 0}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
}

function createListMapping(list: VocabSummaryListItem[]): { [prefix: string]: VocabSummaryListItem[] } {
    return list.reduce<{ [prefix: string]: VocabSummaryListItem[] }>((acc, item) => ({
        ...acc, [item.prefix]: [
            ...(acc[item.prefix] || []),
            item
        ]
    }), {});
}
