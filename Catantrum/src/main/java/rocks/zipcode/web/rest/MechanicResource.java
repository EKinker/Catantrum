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
import rocks.zipcode.domain.Mechanic;
import rocks.zipcode.repository.MechanicRepository;
import rocks.zipcode.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link rocks.zipcode.domain.Mechanic}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MechanicResource {

    private final Logger log = LoggerFactory.getLogger(MechanicResource.class);

    private static final String ENTITY_NAME = "mechanic";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MechanicRepository mechanicRepository;

    public MechanicResource(MechanicRepository mechanicRepository) {
        this.mechanicRepository = mechanicRepository;
    }

    /**
     * {@code POST  /mechanics} : Create a new mechanic.
     *
     * @param mechanic the mechanic to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mechanic, or with status {@code 400 (Bad Request)} if the mechanic has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/mechanics")
    public ResponseEntity<Mechanic> createMechanic(@RequestBody Mechanic mechanic) throws URISyntaxException {
        log.debug("REST request to save Mechanic : {}", mechanic);
        if (mechanic.getId() != null) {
            throw new BadRequestAlertException("A new mechanic cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Mechanic result = mechanicRepository.save(mechanic);
        return ResponseEntity
            .created(new URI("/api/mechanics/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /mechanics/:id} : Updates an existing mechanic.
     *
     * @param id the id of the mechanic to save.
     * @param mechanic the mechanic to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mechanic,
     * or with status {@code 400 (Bad Request)} if the mechanic is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mechanic couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/mechanics/{id}")
    public ResponseEntity<Mechanic> updateMechanic(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Mechanic mechanic
    ) throws URISyntaxException {
        log.debug("REST request to update Mechanic : {}, {}", id, mechanic);
        if (mechanic.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mechanic.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mechanicRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Mechanic result = mechanicRepository.save(mechanic);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mechanic.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /mechanics/:id} : Partial updates given fields of an existing mechanic, field will ignore if it is null
     *
     * @param id the id of the mechanic to save.
     * @param mechanic the mechanic to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mechanic,
     * or with status {@code 400 (Bad Request)} if the mechanic is not valid,
     * or with status {@code 404 (Not Found)} if the mechanic is not found,
     * or with status {@code 500 (Internal Server Error)} if the mechanic couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/mechanics/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Mechanic> partialUpdateMechanic(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Mechanic mechanic
    ) throws URISyntaxException {
        log.debug("REST request to partial update Mechanic partially : {}, {}", id, mechanic);
        if (mechanic.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mechanic.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mechanicRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Mechanic> result = mechanicRepository
            .findById(mechanic.getId())
            .map(existingMechanic -> {
                if (mechanic.getName() != null) {
                    existingMechanic.setName(mechanic.getName());
                }

                return existingMechanic;
            })
            .map(mechanicRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mechanic.getId().toString())
        );
    }

    /**
     * {@code GET  /mechanics} : get all the mechanics.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mechanics in body.
     */
    @GetMapping("/mechanics")
    public List<Mechanic> getAllMechanics() {
        log.debug("REST request to get all Mechanics");
        return mechanicRepository.findAll();
    }

    /**
     * {@code GET  /mechanics/:id} : get the "id" mechanic.
     *
     * @param id the id of the mechanic to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mechanic, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/mechanics/{id}")
    public ResponseEntity<Mechanic> getMechanic(@PathVariable Long id) {
        log.debug("REST request to get Mechanic : {}", id);
        Optional<Mechanic> mechanic = mechanicRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(mechanic);
    }

    /**
     * {@code DELETE  /mechanics/:id} : delete the "id" mechanic.
     *
     * @param id the id of the mechanic to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/mechanics/{id}")
    public ResponseEntity<Void> deleteMechanic(@PathVariable Long id) {
        log.debug("REST request to delete Mechanic : {}", id);
        mechanicRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
