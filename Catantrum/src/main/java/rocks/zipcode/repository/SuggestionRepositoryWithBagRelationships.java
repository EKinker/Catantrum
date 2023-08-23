package rocks.zipcode.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import rocks.zipcode.domain.Suggestion;

public interface SuggestionRepositoryWithBagRelationships {
    Optional<Suggestion> fetchBagRelationships(Optional<Suggestion> suggestion);

    List<Suggestion> fetchBagRelationships(List<Suggestion> suggestions);

    Page<Suggestion> fetchBagRelationships(Page<Suggestion> suggestions);
}
