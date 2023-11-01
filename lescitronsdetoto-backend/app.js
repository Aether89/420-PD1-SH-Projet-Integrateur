const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const HttpError = require('./HttpError');

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const crypto = require('crypto');

const userAccountQueries = require("./queries/UserAccountQueries");
const EmployeRouter = require('./routes/EmployeRouter');
const ClientRouter = require('./routes/ClientRouter');
const citronRouter = require('./routes/citronsdetotoRouter');
const vehiculeRouter = require('./routes/vehiculeRouter');
const transactionRouter = require('./routes/transactionRouter');
const interventionRouter = require('./routes/InterventionRouter');
const accessoireRouter = require('./routes/AccessoireRouter');
const AvailabilityRouter = require('./routes/AvailabilityRouter');
const RendezVousRouter = require('./routes/RendezVousRouter');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', citronRouter)
app.use('/api/vehicule', vehiculeRouter);
app.use('/api/employes', EmployeRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/clients', ClientRouter);
app.use('/api/interventions', interventionRouter);
app.use('/api/accessoires', accessoireRouter);
app.use('/api/apiavailability', AvailabilityRouter);
app.use('/api/rendezvous', RendezVousRouter);


class BasicStrategyModified extends BasicStrategy {
  constructor(options, verify) {
    return super(options, verify);
  }

  _challenge() {
    return 'xBasic realm="' + this._realm + '"';
  }
}

passport.use(new BasicStrategyModified((username, password, cb) => {
  userAccountQueries.getLoginByUserAccountId(username).then(login => {
    if (!login || !login.isActive) {
      return cb(null, false);
    }

    const iterations = 100000;
    const keylen = 64;
    const digest = "sha512";

    crypto.pbkdf2(password, login.passwordSalt, iterations, keylen, digest, (err, hashedPassword) => {
      if (err) {
        return cb(err);
      }

      const passwordHashBuffer = Buffer.from(login.passwordHash, "base64");

      if (!crypto.timingSafeEqual(passwordHashBuffer, hashedPassword)) {
        return cb(null, false);
      }

      return cb(null, login);
    });
  }).catch(err => {
    return cb(err);
  });
}));

app.get('/api/login',
  passport.authenticate('basic', { session: false }),
  (req, res, next) => {

    if (req.user) {
      const userDetails = {
        userAccountId: req.user.userAccountId,
        idEmploye: req.user.idEmploye,
        courrielCompteEmploye: req.user.courrielCompteEmploye,
        isAdmin: req.user.isAdmin,
        isActive: req.user.isActive,
        aChangePassword: req.user.aChangePassword,
      };

      if (req.user.aChangePassword) {
        // Si aChangePassword est true, l'utilisateur doit changer de mot de passe
        userDetails.mustChangePassword = true;
        return res.json(userDetails);
      } else {
        res.json(userDetails);
      }
    } else {
      return next({ status: 500, message: "Propriété user absente" });
    }
  }
);

app.post('/api/login',
  (req, res, next) => {

    
    if (!req.body.userAccountId || req.body.userAccountId === '') {
      return next(new HttpError(400, 'Propriété userAccountId requise'));
    }

    if (!req.body.password || req.body.password === '') {
      return next(new HttpError(400, 'Propriété password requise'));
    }

    const saltBuf = crypto.randomBytes(16);
    const salt = saltBuf.toString("base64");

    crypto.pbkdf2(req.body.password, salt, 100000, 64, "sha512", async (err, derivedKey) => {
      if (err) {
        return next(err);
      }

      const passwordHashBase64 = derivedKey.toString("base64");

      try {
        const userAccountWithPasswordHash = await userAccountQueries.createUserAccount(req.body.userAccountId,
          passwordHashBase64, salt, req.body.userFullName);

        const userDetails = {
          userAccountId: userAccountWithPasswordHash.userAccountId,
          idEmploye: userAccountWithPasswordHash.idEmploye,
          courrielCompteEmploye: userAccountWithPasswordHash.courrielCompteEmploye,
          passwordHash: userAccountWithPasswordHash.passwordHash,
          passwordSalt: userAccountWithPasswordHash.passwordSalt,
        };

        res.json(userDetails);
      } catch (err) {
        return next(err);
      }

    });
  }
);

app.put('/api/changepassword',
  passport.authenticate('basic', { session: false }),
  async (req, res, next) => {
    try {
      const userAccountId = req;
      const oldPassword = req.body.oldPassword;
      const newPassword = req.body.newPassword;
console.log("userAccountId: ", userAccountId);
      // Vérifiez si l'ancien mot de passe est correct avant de le modifier
      const user = await userAccountQueries.getLoginByUserAccountId(userAccountId);
      if (!user) {
        return next(new HttpError(404, 'Utilisateur introuvable'));
      }

      
      const iterations = 100000;
      const keylen = 64;
      const digest = 'sha512';

      crypto.pbkdf2(oldPassword, user.passwordSalt, iterations, keylen, digest, (err, hashedPassword) => {
        if (err) {
          return next(err);
        }

        const passwordHashBuffer = Buffer.from(user.passwordHash, 'base64');

        if (!crypto.timingSafeEqual(passwordHashBuffer, hashedPassword)) {
          return next(new HttpError(401, 'Mot de passe incorrect'));
        }

        // Le mot de passe actuel est correct, générez un nouveau sel et mettez à jour le mot de passe
        const newSaltBuf = crypto.randomBytes(16);
        const newSalt = newSaltBuf.toString('base64');

        crypto.pbkdf2(newPassword, newSalt, iterations, keylen, digest, async (err, newDerivedKey) => {
          if (err) {
            return next(err);
          }

          const newPasswordHashBase64 = newDerivedKey.toString('base64');

          const result = await userAccountQueries.updatePassword(userAccountId, newPasswordHashBase64, newSalt);
          if (!result) {
            return next(new HttpError(500, 'Erreur lors de la mise à jour du mot de passe'));
          }

          res.status(200).json({ success: true });
        });
      });
    } catch (error) {
      return next(error);
    }
  }
);


app.use((err, req, res, next) => {
  console.log("error handler: ", err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500)
  if (err instanceof HttpError) {
    res.json(err.getJsonMessage());
  } else {
    res.json(err);
  }
});

module.exports = app;