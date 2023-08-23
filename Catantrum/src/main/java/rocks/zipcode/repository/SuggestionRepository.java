package rocks.zipcode.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import rocks.zipcode.domain.Suggestion;

/**
 * Spring Data JPA repository for the Suggestion entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SuggestionRepository extends JpaRepository<Suggestion, Long> {}
