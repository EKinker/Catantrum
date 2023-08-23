package rocks.zipcode.repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import rocks.zipcode.domain.Suggestion;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class SuggestionRepositoryWithBagRelationshipsImpl implements SuggestionRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Suggestion> fetchBagRelationships(Optional<Suggestion> suggestion) {
        return suggestion.map(this::fetchGames);
    }

    @Override
    public Page<Suggestion> fetchBagRelationships(Page<Suggestion> suggestions) {
        return new PageImpl<>(fetchBagRelationships(suggestions.getContent()), suggestions.getPageable(), suggestions.getTotalElements());
    }

    @Override
    public List<Suggestion> fetchBagRelationships(List<Suggestion> suggestions) {
        return Optional.of(suggestions).map(this::fetchGames).orElse(Collections.emptyList());
    }

    Suggestion fetchGames(Suggestion result) {
        return entityManager
            .createQuery(
                "select suggestion from Suggestion suggestion left join fetch suggestion.games where suggestion is :suggestion",
                Suggestion.class
            )
            .setParameter("suggestion", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Suggestion> fetchGames(List<Suggestion> suggestions) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, suggestions.size()).forEach(index -> order.put(suggestions.get(index).getId(), index));
        List<Suggestion> result = entityManager
            .createQuery(
                "select distinct suggestion from Suggestion suggestion left join fetch suggestion.games where suggestion in :suggestions",
                Suggestion.class
            )
            .setParameter("suggestions", suggestions)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
