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
import rocks.zipcode.domain.Suggestion;
import rocks.zipcode.repository.SuggestionRepository;
import rocks.zipcode.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link rocks.zipcode.domain.Suggestion}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SuggestionResource {

    private final Logger log = LoggerFactory.getLogger(SuggestionResource.class);

    private static final String ENTITY_NAME = "suggestion";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SuggestionRepository suggestionRepository;

    public SuggestionResource(SuggestionRepository suggestionRepository) {
        this.suggestionRepository = suggestionRepository;
    }

    /**
     * {@code POST  /suggestions} : Create a new suggestion.
     *
     * @param suggestion the suggestion to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new suggestion, or with status {@code 400 (Bad Request)} if the suggestion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/suggestions")
    public ResponseEntity<Suggestion> createSuggestion(@RequestBody Suggestion suggestion) throws URISyntaxException {
        log.debug("REST request to save Suggestion : {}", suggestion);
        if (suggestion.getId() != null) {
            throw new BadRequestAlertException("A new suggestion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Suggestion result = suggestionRepository.save(suggestion);
        return ResponseEntity
            .created(new URI("/api/suggestions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /suggestions/:id} : Updates an existing suggestion.
     *
     * @param id the id of the suggestion to save.
     * @param suggestion the suggestion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated suggestion,
     * or with status {@code 400 (Bad Request)} if the suggestion is not valid,
     * or with status {@code 500 (Internal Server Error)} if the suggestion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/suggestions/{id}")
    public ResponseEntity<Suggestion> updateSuggestion(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Suggestion suggestion
    ) throws URISyntaxException {
        log.debug("REST request to update Suggestion : {}, {}", id, suggestion);
        if (suggestion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, suggestion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!suggestionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Suggestion result = suggestionRepository.save(suggestion);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, suggestion.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /suggestions/:id} : Partial updates given fields of an existing suggestion, field will ignore if it is null
     *
     * @param id the id of the suggestion to save.
     * @param suggestion the suggestion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated suggestion,
     * or with status {@code 400 (Bad Request)} if the suggestion is not valid,
     * or with status {@code 404 (Not Found)} if the suggestion is not found,
     * or with status {@code 500 (Internal Server Error)} if the suggestion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/suggestions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Suggestion> partialUpdateSuggestion(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Suggestion suggestion
    ) throws URISyntaxException {
        log.debug("REST request to partial update Suggestion partially : {}, {}", id, suggestion);
        if (suggestion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, suggestion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!suggestionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Suggestion> result = suggestionRepository
            .findById(suggestion.getId())
            .map(existingSuggestion -> {
                if (suggestion.getResult() != null) {
                    existingSuggestion.setResult(suggestion.getResult());
                }

                return existingSuggestion;
            })
            .map(suggestionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, suggestion.getId().toString())
        );
    }

    /**
     * {@code GET  /suggestions} : get all the suggestions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of suggestions in body.
     */
    @GetMapping("/suggestions")
    public List<Suggestion> getAllSuggestions() {
        log.debug("REST request to get all Suggestions");
        return suggestionRepository.findAll();
    }

    /**
     * {@code GET  /suggestions/:id} : get the "id" suggestion.
     *
     * @param id the id of the suggestion to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the suggestion, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/suggestions/{id}")
    public ResponseEntity<Suggestion> getSuggestion(@PathVariable Long id) {
        log.debug("REST request to get Suggestion : {}", id);
        Optional<Suggestion> suggestion = suggestionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(suggestion);
    }

    /**
     * {@code DELETE  /suggestions/:id} : delete the "id" suggestion.
     *
     * @param id the id of the suggestion to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/suggestions/{id}")
    public ResponseEntity<Void> deleteSuggestion(@PathVariable Long id) {
        log.debug("REST request to delete Suggestion : {}", id);
        suggestionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
