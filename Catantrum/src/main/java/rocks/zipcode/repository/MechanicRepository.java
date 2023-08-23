package rocks.zipcode.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import rocks.zipcode.domain.Mechanic;

/**
 * Spring Data JPA repository for the Mechanic entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MechanicRepository extends JpaRepository<Mechanic, Long> {}
