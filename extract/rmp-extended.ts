// rmp-extended.ts
import { API_LINK, HEADERS, retrieve_school_id } from "rate-my-professor-api-ts";

const TEACHER_LIST_PAGED = `
query TeacherSearchResultsPageQuery(
  $query: TeacherSearchQuery!
  $schoolID: ID
  $includeSchoolFilter: Boolean!
  $first: Int!
  $after: String
) {
  search: newSearch {
    teachers(query: $query, first: $first, after: $after) {
      edges {
        cursor
        node {
          id legacyId firstName lastName department
          avgRating avgDifficulty numRatings wouldTakeAgainPercent
          school { name id }
        }
      }
      pageInfo { hasNextPage endCursor }
      resultCount
    }
  }
  school: node(id: $schoolID) @include(if: $includeSchoolFilter) {
    __typename
    ... on School { name }
    id
  }
}
`;

async function gq<T = any>(query: string, variables: Record<string, any>): Promise<T> {
  const res = await fetch(API_LINK, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: HEADERS as any,
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`RMP GraphQL ${res.status}`);
  return res.json();
}

async function get_professor_list_by_school_all(college_name: string, pageSize = 200) {
  const college_id = (await retrieve_school_id(college_name)) as unknown as string;
  const out: {
    avg_difficulty: number;
    avg_rating: number;
    department: String;
    name: String;
    num_ratings: number;
    would_take_again_percent: number;
  }[] = [];

  let after: string | null = null;
  for (;;) {
    const variables = {
      query: { text: "", schoolID: college_id, fallback: true, departmentID: null },
      schoolID: college_id,
      includeSchoolFilter: true,
      first: pageSize,
      after,
    };

    const data = await gq<any>(TEACHER_LIST_PAGED, variables);
    const page = data.data.search.teachers;

    for (const { node: n } of page.edges) {
      out.push({
        avg_difficulty: n?.avgDifficulty != null ? parseFloat(n.avgDifficulty) : 0,
        avg_rating: n?.avgRating != null ? parseFloat(n.avgRating) : 0,
        department: (n?.department ?? "") as unknown as String,
        name: `${n?.firstName ?? ""} ${n?.lastName ?? ""}` as unknown as String,
        num_ratings: n?.numRatings != null ? parseInt(n.numRatings, 10) : 0,
        would_take_again_percent:
          n?.wouldTakeAgainPercent != null ? parseFloat(n.wouldTakeAgainPercent) : 0,
      });
    }

    if (!page.pageInfo.hasNextPage) break;
    after = page.pageInfo.endCursor;
    await new Promise(r => setTimeout(r, 200));
  }
  return out;
}

// add a default export (CJS/ESM interop-safe)
function __ping() { return "ok"; }
export default { get_professor_list_by_school_all, __ping };
