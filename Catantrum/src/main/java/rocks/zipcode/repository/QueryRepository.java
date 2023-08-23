package rocks.zipcode.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import rocks.zipcode.domain.Query;

/**
 * Spring Data JPA repository for the Query entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QueryRepository extends JpaRepository<Query, Long> {}
