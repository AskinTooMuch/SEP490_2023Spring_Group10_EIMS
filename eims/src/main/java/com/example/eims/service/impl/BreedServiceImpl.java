package com.example.eims.service.impl;

import com.example.eims.dto.breed.DetailBreedDTO;
import com.example.eims.dto.breed.NewBreedDTO;
import com.example.eims.dto.breed.EditBreedDTO;
import com.example.eims.dto.file.FileResponse;
import com.example.eims.entity.Breed;
import com.example.eims.entity.Specie;
import com.example.eims.repository.BreedRepository;
import com.example.eims.repository.SpecieRepository;
import com.example.eims.service.interfaces.IBreedService;
import jakarta.servlet.http.HttpServlet;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.Optional;
@Service
public class BreedServiceImpl implements IBreedService {
    @Autowired
    private final SpecieRepository specieRepository;
    @Autowired
    private final BreedRepository breedRepository;
    @Autowired
    private final FileStorageService fileStorageService;

    public BreedServiceImpl(SpecieRepository specieRepository, BreedRepository breedRepository, FileStorageService fileStorageService) {
        this.specieRepository = specieRepository;
        this.breedRepository = breedRepository;
        this.fileStorageService = fileStorageService;
    }

    /**
     * Service to create a new Breed.
     * The newly added breed will have the status of 1 (true)
     * @param newBreedDTO Payload
     * @return New breed created or response message
     */
    @Override
    public ResponseEntity<?> createNewBreed(@ModelAttribute NewBreedDTO newBreedDTO) {
        System.out.println(newBreedDTO);
        Optional<Specie> specieOpt = specieRepository.findById(newBreedDTO.getSpecieId());
        if (specieOpt.isPresent()) {
            Specie specie = specieOpt.get();
            //Create file attributes
            //String filename = fileStorageService.storeFile(newBreedDTO.getImage());
            //Set other attributes
            Breed breed = new Breed();
            breed.setSpecieId(specie.getSpecieId());
            breed.setUserId(specie.getUserId());
            breed.setBreedName(newBreedDTO.getBreedName());
            breed.setAverageWeightMale(newBreedDTO.getAverageWeightMale());
            breed.setAverageWeightFemale(newBreedDTO.getAverageWeightFemale());
            breed.setCommonDisease(newBreedDTO.getCommonDisease());
            breed.setGrowthTime(newBreedDTO.getGrowthTime());
            //breed.setImageSrc(filename);
            breed.setStatus(true);
            try {
                breedRepository.save(breed);
            } catch (IllegalArgumentException iae) {
                return null;
            }
            return new ResponseEntity<>("Breed added successfully", HttpStatus.OK);
        }
        return new ResponseEntity<>("Breed not found with Id number "+newBreedDTO.getSpecieId(), HttpStatus.BAD_REQUEST);
    }

    /**
     * Service to update existing breed.
     * The new information will be updated through the breed id
     * @param editBreedDTO Payload
     * @return Breed updated or response message
     */
    @Override
    public ResponseEntity<?> updateBreed(EditBreedDTO editBreedDTO) {
        System.out.println(editBreedDTO);
        Optional<Breed> breedOpt = breedRepository.findById(editBreedDTO.getBreedId());
        if (breedOpt.isPresent()) {
            Breed breed = breedOpt.get();
            //Create file attributes
            String filename = fileStorageService.storeFile(editBreedDTO.getImage());
            //Set other attributes
            breed.setSpecieId(editBreedDTO.getSpecieId());
            breed.setBreedName(editBreedDTO.getBreedName());
            breed.setAverageWeightMale(editBreedDTO.getAverageWeightMale());
            breed.setAverageWeightFemale(editBreedDTO.getAverageWeightFemale());
            breed.setCommonDisease(editBreedDTO.getCommonDisease());
            breed.setGrowthTime(editBreedDTO.getGrowthTime());
            breed.setImageSrc(filename);
            breed.setStatus(editBreedDTO.isStatus());
            try {
                breedRepository.save(breed);
            } catch (IllegalArgumentException iae) {
                return null;
            }
            return new ResponseEntity<>("Breed saved successfully", HttpStatus.OK);
        }
        return new ResponseEntity<>("Breed not found with Id number "+editBreedDTO.getBreedId(), HttpStatus.BAD_REQUEST);
    }

    /**
     * Service to delete (disable) existing breed.
     * The new information will be updated through the breed id
     * @param breedId Breed id to be disabled
     * @return Response message
     */
    @Override
    public ResponseEntity<?> deleteBreed(Long breedId) {
        Optional<Breed> breedOpt = breedRepository.findById(breedId);
        if (breedOpt.isPresent()) {
            Breed breed = breedOpt.get();
            breed.setStatus(false);
            breedRepository.save(breed);
            return new ResponseEntity<>("Delete breed successfully", HttpStatus.OK);
        }
        return new ResponseEntity<>("Breed not found", HttpStatus.BAD_REQUEST);
    }

    /**
     * Service to view detail information of 1 breed
     * @param breedId Breed id to be queried
     * @return Breed information or response message
     */
    @Override
    public ResponseEntity<?> viewBreedDetailById(Long breedId, HttpServlet request) {
        Optional<Breed> breedOpt = breedRepository.findById(breedId);
        if (breedOpt.isPresent()) {
            Breed breed = breedOpt.get();
            DetailBreedDTO detailBreedDTO = new DetailBreedDTO(breed);
            Resource resource = fileStorageService.loadFileAsResource(breed.getImageSrc());
            String contentType = null;
            try {
                contentType = request
                        .getServletContext()
                        .getMimeType(resource.getFile().getAbsolutePath());
                detailBreedDTO.setImage(resource);
            } catch (IOException ex) {
                System.out.println("Could not get file");
            }
            if (contentType==null) {
                contentType = "application/octet-stream";
            }
            return new ResponseEntity<>(breedOpt.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>("Breed not found", HttpStatus.BAD_REQUEST);
    }

    /**
     * Service to view breed detail information of 1 specie
     * @param specieId Specie id to be queried
     * @return Breed information or response message
     */
    @Override
    public ResponseEntity<?> viewBreedDetailBySpecie(Long specieId) {
        Optional<List<Breed>> breedOpt = breedRepository.findBySpecieId(specieId);
        if (breedOpt.isPresent()) {
            return new ResponseEntity<>(breedOpt.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>("Breed not found", HttpStatus.BAD_REQUEST);
    }

    /**
     * Service to view breed detail information of 1 specie
     * @param userId User id to be queried
     * @return Breed information or response message
     */
    @Override
    public ResponseEntity<?> viewBreedDetailByUser(Long userId) {
        Optional<List<Breed>> breedOpt = breedRepository.findByUserId(userId);
        if (breedOpt.isPresent()) {
            return new ResponseEntity<>(breedOpt.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>("Breed not found", HttpStatus.BAD_REQUEST);
    }

}
