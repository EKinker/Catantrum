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
import rocks.zipcode.domain.Game;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class GameRepositoryWithBagRelationshipsImpl implements GameRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Game> fetchBagRelationships(Optional<Game> game) {
        return game.map(this::fetchCategories).map(this::fetchMechanics);
    }

    @Override
    public Page<Game> fetchBagRelationships(Page<Game> games) {
        return new PageImpl<>(fetchBagRelationships(games.getContent()), games.getPageable(), games.getTotalElements());
    }

    @Override
    public List<Game> fetchBagRelationships(List<Game> games) {
        return Optional.of(games).map(this::fetchCategories).map(this::fetchMechanics).orElse(Collections.emptyList());
    }

    Game fetchCategories(Game result) {
        return entityManager
            .createQuery("select game from Game game left join fetch game.categories where game is :game", Game.class)
            .setParameter("game", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Game> fetchCategories(List<Game> games) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, games.size()).forEach(index -> order.put(games.get(index).getId(), index));
        List<Game> result = entityManager
            .createQuery("select distinct game from Game game left join fetch game.categories where game in :games", Game.class)
            .setParameter("games", games)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }

    Game fetchMechanics(Game result) {
        return entityManager
            .createQuery("select game from Game game left join fetch game.mechanics where game is :game", Game.class)
            .setParameter("game", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Game> fetchMechanics(List<Game> games) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, games.size()).forEach(index -> order.put(games.get(index).getId(), index));
        List<Game> result = entityManager
            .createQuery("select distinct game from Game game left join fetch game.mechanics where game in :games", Game.class)
            .setParameter("games", games)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
