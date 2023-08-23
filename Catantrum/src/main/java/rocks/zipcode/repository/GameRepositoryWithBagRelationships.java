package rocks.zipcode.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import rocks.zipcode.domain.Game;

public interface GameRepositoryWithBagRelationships {
    Optional<Game> fetchBagRelationships(Optional<Game> game);

    List<Game> fetchBagRelationships(List<Game> games);

    Page<Game> fetchBagRelationships(Page<Game> games);
}
