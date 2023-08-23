package rocks.zipcode.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import rocks.zipcode.domain.Query;
import rocks.zipcode.repository.QueryRepository;
import rocks.zipcode.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link rocks.zipcode.domain.Query}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class QueryResource {

    private final Logger log = LoggerFactory.getLogger(QueryResource.class);

    private static final String ENTITY_NAME = "query";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final QueryRepository queryRepository;

    public QueryResource(QueryRepository queryRepository) {
        this.queryRepository = queryRepository;
    }

    /**
     * {@code POST  /queries} : Create a new query.
     *
     * @param query the query to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new query, or with status {@code 400 (Bad Request)} if the query has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/queries")
    public ResponseEntity<Query> createQuery(@RequestBody Query query) throws URISyntaxException {
        log.debug("REST request to save Query : {}", query);
        if (query.getId() != null) {
            throw new BadRequestAlertException("A new query cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Query result = queryRepository.save(query);
        return ResponseEntity
            .created(new URI("/api/queries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /queries/:id} : Updates an existing query.
     *
     * @param id the id of the query to save.
     * @param query the query to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated query,
     * or with status {@code 400 (Bad Request)} if the query is not valid,
     * or with status {@code 500 (Internal Server Error)} if the query couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/queries/{id}")
    public ResponseEntity<Query> updateQuery(@PathVariable(value = "id", required = false) final Long id, @RequestBody Query query)
        throws URISyntaxException {
        log.debug("REST request to update Query : {}, {}", id, query);
        if (query.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, query.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!queryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Query result = queryRepository.save(query);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, query.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /queries/:id} : Partial updates given fields of an existing query, field will ignore if it is null
     *
     * @param id the id of the query to save.
     * @param query the query to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated query,
     * or with status {@code 400 (Bad Request)} if the query is not valid,
     * or with status {@code 404 (Not Found)} if the query is not found,
     * or with status {@code 500 (Internal Server Error)} if the query couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/queries/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Query> partialUpdateQuery(@PathVariable(value = "id", required = false) final Long id, @RequestBody Query query)
        throws URISyntaxException {
        log.debug("REST request to partial update Query partially : {}, {}", id, query);
        if (query.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, query.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!queryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Query> result = queryRepository
            .findById(query.getId())
            .map(existingQuery -> {
                if (query.getMechanic() != null) {
                    existingQuery.setMechanic(query.getMechanic());
                }
                if (query.getCategory() != null) {
                    existingQuery.setCategory(query.getCategory());
                }

                return existingQuery;
            })
            .map(queryRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, query.getId().toString())
        );
    }

    /**
     * {@code GET  /queries} : get all the queries.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of queries in body.
     */
    @GetMapping("/queries")
    public List<Query> getAllQueries() {
        log.debug("REST request to get all Queries");
        return queryRepository.findAll();
    }

    /**
     * {@code GET  /queries/:id} : get the "id" query.
     *
     * @param id the id of the query to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the query, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/queries/{id}")
    public ResponseEntity<Query> getQuery(@PathVariable Long id) {
        log.debug("REST request to get Query : {}", id);
        Optional<Query> query = queryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(query);
    }

    /**
     * {@code DELETE  /queries/:id} : delete the "id" query.
     *
     * @param id the id of the query to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/queries/{id}")
    public ResponseEntity<Void> deleteQuery(@PathVariable Long id) {
        log.debug("REST request to delete Query : {}", id);
        queryRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
